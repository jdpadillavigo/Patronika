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

async function deletePublication(publicationId: string) {
    try {
        await AdminCommunityRepository.deletePublication(publicationId);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo eliminar la publicación';
        return { success: false as const, error: message };
    }
}

async function clearCommentReports(commentId: string) {
    void commentId;
    // TODO: Call the backend endpoint to clear comment reports when it exists.
    return { success: true as const };
}

async function clearPublicationReports(publicationId: string) {
    void publicationId;
    // TODO: Call the backend endpoint to clear publication reports when it exists.
    return { success: true as const };
}

async function sanctionUserAndDeleteComment(commentId: string, sanctionDraft: { days: number; reason: string }) {
    if (!Number.isInteger(sanctionDraft.days) || sanctionDraft.days <= 0) {
        return { success: false as const, error: 'Ingresa una cantidad de días válida.' };
    }
    if (!sanctionDraft.reason.trim()) {
        return { success: false as const, error: 'Ingresa el motivo de suspensión.' };
    }

    try {
        void sanctionDraft;
        await AdminCommunityRepository.deleteComment(commentId);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo eliminar el comentario';
        return { success: false as const, error: message };
    }
}

const AdminCommunityUseCase = {
    loadDashboard,
    deleteComment,
    deletePublication,
    clearCommentReports,
    clearPublicationReports,
    sanctionUserAndDeletePublication,
    sanctionUserAndDeleteComment,
};

export default AdminCommunityUseCase;
