import { isSessionExpiredError } from '../../../../../../core/data/network/HttpClientExt';
import UserRepository from '../../../../../../core/data/user/repositories/UserRepository';
import AdminPostRepository from '../../data/repositories/AdminPostRepository';

async function loadPublications() {
    try {
        const publications = await AdminPostRepository.loadPublications();
        return { success: true as const, data: publications };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo cargar la gestión de publicaciones';
        return { success: false as const, error: message };
    }
}

async function deletePublication(publicationId: string) {
    try {
        await AdminPostRepository.deletePublication(publicationId);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo eliminar la publicación';
        return { success: false as const, error: message };
    }
}

async function clearPublicationReports(publicationId: string) {
    try {
        await AdminPostRepository.clearPublicationReports(publicationId);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudieron eliminar los reportes de la publicación';
        return { success: false as const, error: message };
    }
}

async function sanctionUserAndDeletePublication(publicationId: string, sanctionDraft: { days: number; reason: string }, userId?: string | null) {
    if (!Number.isInteger(sanctionDraft.days) || sanctionDraft.days <= 0) {
        return { success: false as const, error: 'Ingresa una cantidad de días válida.' };
    }
    if (!sanctionDraft.reason.trim()) {
        return { success: false as const, error: 'Ingresa el motivo de suspensión.' };
    }
    if (!userId) {
        return { success: false as const, error: 'No se pudo identificar al usuario de la publicación.' };
    }

    try {
        await UserRepository.suspendUserById(userId, sanctionDraft.days, sanctionDraft.reason.trim());
        await AdminPostRepository.deletePublication(publicationId);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'No se pudo sancionar y eliminar la publicación';
        return { success: false as const, error: message };
    }
}

const AdminPostUseCase = {
    loadPublications,
    deletePublication,
    clearPublicationReports,
    sanctionUserAndDeletePublication,
};

export default AdminPostUseCase;
