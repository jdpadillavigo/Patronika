// Capa de datos: comunicación con el backend para comentarios.
// El backend NO filtra comentarios por publicación, devuelve todos.
// El filtro por publicación se hace en CommentRepository (lado cliente).
import HttpClient, { cacheAfterWrite, cachedRead, type ApiResponse } from '../../../../core/data/network/HttpClientExt';
import { assertApiSuccess } from '../../../../core/data/network/dto/ApiResponseDto';

export interface Comment {
    id: string;
    userId: string;
    publicationId: string;
    content: string;
    reportCount: number;
    createdAt: string;
    updatedAt?: string | null;
}

const COMMENTS = '/api/comments';

// GET /api/comments — devuelve TODOS los comentarios (sin filtro por publicación)
async function loadAll(refresh = false): Promise<Comment[]> {
    return cachedRead(COMMENTS, async () => {
        const response = await HttpClient.get<ApiResponse<Comment[]>>(COMMENTS);
        return assertApiSuccess(response, 'No se pudieron cargar los comentarios') || [];
    }, { ttlMs: 60_000, refresh, collection: true });
}

// POST /api/comments — el backend requiere el userId en el header "UserId"
async function create(userId: string, publicationId: string, content: string): Promise<Comment> {
    return cacheAfterWrite(async () => {
        const response = await HttpClient.post<ApiResponse<Comment>>(
            COMMENTS,
            { content, publicationId },
            { headers: { UserId: userId } },
        );
        const comment = assertApiSuccess(response, 'No se pudo publicar el comentario');
        if (!comment) throw new Error('No se pudo publicar el comentario');
        return comment;
    }, (cache, comment) => cache.update<Comment[]>(COMMENTS, comments =>
        [...comments.filter(item => item.id !== comment.id), comment],
    ));
}

// PUT /api/comments/{id}
async function update(id: string, content: string, publicationId: string): Promise<void> {
    await cacheAfterWrite(
        () => HttpClient.put<ApiResponse<string>>(`${COMMENTS}/${id}`, { content, publicationId }),
        cache => cache.update<Comment[]>(COMMENTS, comments => comments.map(comment =>
            comment.id === id ? { ...comment, content, updatedAt: new Date().toISOString() } : comment,
        )),
    );
}

// DELETE /api/comments/{id}
async function remove(id: string): Promise<void> {
    await cacheAfterWrite(
        () => HttpClient.delete<ApiResponse<string>>(`${COMMENTS}/${id}`),
        cache => cache.update<Comment[]>(COMMENTS, comments => comments.filter(comment => comment.id !== id)),
    );
}

// POST /api/comments/{id}/report — incrementa el contador de reportes
async function report(id: string): Promise<void> {
    await cacheAfterWrite(
        () => HttpClient.post<ApiResponse<string>>(`${COMMENTS}/${id}/report`, {}),
        cache => cache.update<Comment[]>(COMMENTS, comments => comments.map(comment =>
            comment.id === id ? { ...comment, reportCount: (comment.reportCount || 0) + 1 } : comment,
        )),
    );
}

// POST /api/comments/{id}/clear-reports
async function clearReports(id: string): Promise<Comment | null> {
    return cacheAfterWrite(async () => {
        const response = await HttpClient.post<ApiResponse<Comment>>(`${COMMENTS}/${id}/clear-reports`, {});
        return assertApiSuccess(response, 'Reportes eliminados correctamente');
    }, (cache, updated) => cache.update<Comment[]>(COMMENTS, comments => comments.map(comment =>
        comment.id === id ? updated ?? { ...comment, reportCount: 0 } : comment,
    )));
}

const CommentRemoteDataSource = {
    loadAll,
    create,
    update,
    remove,
    report,
    clearReports,
};

export default CommentRemoteDataSource;
