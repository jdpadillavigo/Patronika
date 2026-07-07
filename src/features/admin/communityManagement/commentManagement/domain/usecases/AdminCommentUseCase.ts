import { isSessionExpiredError } from '../../../../../../core/data/network/HttpClientExt';
import UserRepository from '../../../../../../core/data/user/repositories/UserRepository';
import type { Publication } from '../../../../../post/data/networking/PublicationRemoteDataSource';
import AdminCommentRepository from '../../data/repositories/AdminCommentRepository';

async function loadComments(publications?: Publication[]) {
    try {
        const comments = await AdminCommentRepository.loadComments(publications);
        return { success: true as const, data: comments };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo cargar la gestión de comentarios';
        return { success: false as const, error: message };
    }
}

async function deleteComment(commentId: string) {
    try {
        await AdminCommentRepository.deleteComment(commentId);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo eliminar el comentario';
        return { success: false as const, error: message };
    }
}

async function clearCommentReports(commentId: string) {
    try {
        const comment = await AdminCommentRepository.clearCommentReports(commentId);
        return { success: true as const, data: comment };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudieron eliminar los reportes del comentario';
        return { success: false as const, error: message };
    }
}

async function sanctionUserAndDeleteComment(commentId: string, sanctionDraft: { days: number; reason: string }, userId?: string | null) {
    if (!Number.isInteger(sanctionDraft.days) || sanctionDraft.days <= 0) {
        return { success: false as const, error: 'Ingresa una cantidad de días válida.' };
    }
    if (!sanctionDraft.reason.trim()) {
        return { success: false as const, error: 'Ingresa el motivo de suspensión.' };
    }
    if (!userId) {
        return { success: false as const, error: 'No se pudo identificar al usuario del comentario.' };
    }

    try {
        await UserRepository.suspendUserById(userId, sanctionDraft.days, sanctionDraft.reason.trim());
        await AdminCommentRepository.deleteComment(commentId);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo eliminar el comentario';
        return { success: false as const, error: message };
    }
}

const AdminCommentUseCase = {
    loadComments,
    deleteComment,
    clearCommentReports,
    sanctionUserAndDeleteComment,
};

export default AdminCommentUseCase;
