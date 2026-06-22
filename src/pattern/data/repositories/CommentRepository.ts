// Repositorio de comentarios.
// El backend no tiene endpoint para filtrar por publicación, así que se cargan
// todos y se filtra localmente por publicationId.
import ApiClient from '../../../core/data/networking/ApiClient';
import type { User } from '../../domain/models/User';
import CommentRemoteDataSource, { type Comment } from '../networking/CommentRemoteDataSource';

// Carga los comentarios de una publicación específica (filtro local)
async function loadForPublication(publicationId: string): Promise<Comment[]> {
    const all = await CommentRemoteDataSource.loadAll();
    return all.filter(c => c.publicationId === publicationId);
}

// Agrega un comentario; el userId se toma del usuario en sesión
async function addComment(publicationId: string, content: string): Promise<Comment> {
    const currentUser = await ApiClient.getCurrentUser<User>();
    if (!currentUser?.id) throw new Error('Inicia sesión para comentar');
    return CommentRemoteDataSource.create(currentUser.id, publicationId, content);
}

async function editComment(commentId: string, publicationId: string, content: string): Promise<void> {
    return CommentRemoteDataSource.update(commentId, content, publicationId);
}

async function deleteComment(id: string): Promise<void> {
    return CommentRemoteDataSource.remove(id);
}

const CommentRepository = {
    loadForPublication,
    addComment,
    editComment,
    deleteComment,
};

export default CommentRepository;
