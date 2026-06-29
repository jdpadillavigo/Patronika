import { isSessionExpiredError } from '../../../../../core/data/network/HttpClientExt';
import AdminCommunityRepository from '../../data/repositories/AdminCommunityRepository';

async function loadDashboard() {
    try {
        const data = await AdminCommunityRepository.loadDashboard();
        return { success: true as const, data };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo cargar la gestión de comunidad';
        return { success: false as const, error: message };
    }
}

async function deleteComment(commentId: string) {
    try {
        await AdminCommunityRepository.deleteComment(commentId);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo eliminar el comentario';
        return { success: false as const, error: message };
    }
}

async function reportAndDeletePublication(publicationId: string, warningMessage: string, reason: string) {
    if (!warningMessage.trim()) {
        return { success: false as const, error: 'Escribe el mensaje de advertencia' };
    }
    if (!reason.trim()) {
        return { success: false as const, error: 'Escribe el motivo de eliminación' };
    }

    try {
        await AdminCommunityRepository.deletePublication(publicationId);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo eliminar la publicación';
        return { success: false as const, error: message };
    }
}

const AdminCommunityUseCase = {
    loadDashboard,
    deleteComment,
    reportAndDeletePublication,
};

export default AdminCommunityUseCase;
