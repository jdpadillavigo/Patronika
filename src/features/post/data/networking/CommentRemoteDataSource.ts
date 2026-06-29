// Capa de datos: comunicación con el backend para comentarios.
// El backend NO filtra comentarios por publicación, devuelve todos.
// El filtro por publicación se hace en CommentRepository (lado cliente).
import HttpClient, { type ApiResponse } from '../../../../core/data/network/HttpClientExt';
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

// GET /api/comments — devuelve TODOS los comentarios (sin filtro por publicación)
async function loadAll(): Promise<Comment[]> {
    const response = await HttpClient.get<ApiResponse<Comment[]>>('/api/comments');
    return assertApiSuccess(response, 'No se pudieron cargar los comentarios') || [];
}

// POST /api/comments — el backend requiere el userId en el header "UserId"
async function create(userId: string, publicationId: string, content: string): Promise<Comment> {
    const response = await HttpClient.post<ApiResponse<Comment>>(
        '/api/comments',
        { content, publicationId },
        { headers: { UserId: userId } },
    );
    const comment = assertApiSuccess(response, 'No se pudo publicar el comentario');
    if (!comment) throw new Error('No se pudo publicar el comentario');
    return comment;
}

// PUT /api/comments/{id}
async function update(id: string, content: string, publicationId: string): Promise<void> {
    await HttpClient.put<ApiResponse<string>>(`/api/comments/${id}`, { content, publicationId });
}

// DELETE /api/comments/{id}
async function remove(id: string): Promise<void> {
    await HttpClient.delete<ApiResponse<string>>(`/api/comments/${id}`);
}

// POST /api/comments/{id}/report — incrementa el contador de reportes
async function report(id: string): Promise<void> {
    await HttpClient.post<ApiResponse<string>>(`/api/comments/${id}/report`, {});
}

const CommentRemoteDataSource = {
    loadAll,
    create,
    update,
    remove,
    report,
};

export default CommentRemoteDataSource;
