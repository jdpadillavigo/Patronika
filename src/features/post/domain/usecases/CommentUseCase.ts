// Caso de uso de comentarios: lógica de negocio entre la UI y el repositorio.
import { isSessionExpiredError } from '../../../../core/data/network/HttpClientExt';
import CommentRepository from '../../data/repositories/CommentRepository';

// Carga los comentarios de una publicación específica
async function loadForPublication(publicationId: string) {
    try {
        const comments = await CommentRepository.loadForPublication(publicationId);
        return { success: true as const, data: comments };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true, data: [] };
        const message = error instanceof Error ? error.message : 'Error al cargar comentarios';
        return { success: false as const, error: message, data: [] };
    }
}

// Agrega un comentario; valida que el contenido no esté vacío
async function addComment(publicationId: string, content: string) {
    if (!content.trim()) return { success: false as const, error: 'Escribe un comentario' };
    try {
        const comment = await CommentRepository.addComment(publicationId, content.trim());
        return { success: true as const, data: comment };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al comentar';
        return { success: false as const, error: message };
    }
}

// Edita un comentario existente
async function editComment(commentId: string, publicationId: string, content: string) {
    if (!content.trim()) return { success: false as const, error: 'El comentario no puede estar vacío' };
    try {
        await CommentRepository.editComment(commentId, publicationId, content.trim());
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al editar';
        return { success: false as const, error: message };
    }
}

// Elimina un comentario
async function deleteComment(id: string) {
    try {
        await CommentRepository.deleteComment(id);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al eliminar comentario';
        return { success: false as const, error: message };
    }
}

const CommentUseCase = {
    loadForPublication,
    addComment,
    editComment,
    deleteComment,
};

export default CommentUseCase;
