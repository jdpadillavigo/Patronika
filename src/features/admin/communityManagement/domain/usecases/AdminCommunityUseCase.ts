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

async function sanctionUserAndDeletePublication(publicationId: string, sanctionDraft: { days: number; reason: string }) {
    if (!Number.isInteger(sanctionDraft.days) || sanctionDraft.days <= 0) {
        return { success: false as const, error: 'Ingresa una cantidad de días válida.' };
    }
    if (!sanctionDraft.reason.trim()) {
        return { success: false as const, error: 'Ingresa el motivo de suspensión.' };
    }

    try {
        void sanctionDraft;
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
    sanctionUserAndDeletePublication,
};

export default AdminCommunityUseCase;
