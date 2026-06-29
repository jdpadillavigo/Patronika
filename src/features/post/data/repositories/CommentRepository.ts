// Repositorio de comentarios.
// El backend no tiene endpoint para filtrar por publicación, así que se cargan
// todos y se filtra localmente por publicationId.
import HttpClient from '../../../../core/data/network/HttpClientExt';
import type { User } from '../../../../core/domain/models/User';
import CommentRemoteDataSource, { type Comment } from '../networking/CommentRemoteDataSource';

// Carga los comentarios de una publicación específica (filtro local)
async function loadForPublication(publicationId: string): Promise<Comment[]> {
    const all = await CommentRemoteDataSource.loadAll();
    return all.filter(c => c.publicationId === publicationId);
}

// Agrega un comentario; el userId se toma del usuario en sesión
async function addComment(publicationId: string, content: string): Promise<Comment> {
    const currentUser = await HttpClient.getCurrentUser<User>();
    if (!currentUser?.id) throw new Error('Inicia sesión para comentar');
    return CommentRemoteDataSource.create(currentUser.id, publicationId, content);
}

async function editComment(commentId: string, publicationId: string, content: string): Promise<void> {
    return CommentRemoteDataSource.update(commentId, content, publicationId);
}

async function deleteComment(id: string): Promise<void> {
    return CommentRemoteDataSource.remove(id);
}

async function reportComment(id: string): Promise<void> {
    return CommentRemoteDataSource.report(id);
}

const CommentRepository = {
    loadForPublication,
    addComment,
    editComment,
    deleteComment,
    reportComment,
};

export default CommentRepository;
