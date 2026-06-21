// Capa de datos: comunicación con el backend para comentarios.
// El backend NO filtra comentarios por publicación, devuelve todos.
// El filtro por publicación se hace en CommentRepository (lado cliente).
import ApiClient, { type ApiResponse } from '../../../core/data/networking/ApiClient';
import { assertApiSuccess } from './dto/ApiResponseDto';

export interface Comment {
    id: string;
    userId: string;
    publicationId: string;
    content: string;
    createdAt: string;
    updatedAt?: string | null;
}

// GET /api/comments — devuelve TODOS los comentarios (sin filtro por publicación)
async function loadAll(): Promise<Comment[]> {
    const response = await ApiClient.get<ApiResponse<Comment[]>>('/api/comments');
    return assertApiSuccess(response, 'No se pudieron cargar los comentarios') || [];
}

// POST /api/comments — el backend requiere el userId en el header "UserId"
async function create(userId: string, publicationId: string, content: string): Promise<Comment> {
    const response = await ApiClient.post<ApiResponse<Comment>>(
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
    await ApiClient.put<ApiResponse<string>>(`/api/comments/${id}`, { content, publicationId });
}

// DELETE /api/comments/{id}
async function remove(id: string): Promise<void> {
    await ApiClient.delete<ApiResponse<string>>(`/api/comments/${id}`);
}

const CommentRemoteDataSource = {
    loadAll,
    create,
    update,
    remove,
};

export default CommentRemoteDataSource;
