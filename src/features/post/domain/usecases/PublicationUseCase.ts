// Caso de uso de publicaciones: lógica de negocio entre la UI y el repositorio.
// Todas las funciones devuelven { success, data?, error?, sessionExpired? }
// para que la pantalla solo decida qué mostrar, sin conocer detalles de red.
import { isSessionExpiredError } from '../../../../core/data/network/HttpClientExt';
import PublicationRepository from '../../data/repositories/PublicationRepository';

// Carga el feed completo de la comunidad
async function loadFeed() {
    try {
        const publications = await PublicationRepository.loadFeed();
        return { success: true as const, data: publications };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true, data: [] };
        const message = error instanceof Error ? error.message : 'Error al cargar el feed';
        return { success: false as const, error: message, data: [] };
    }
}

// Crea una publicación. Valida que haya descripción antes de llamar al backend.
async function create(patternId: string, description: string, technique: number, imageUri?: string | null) {
    if (!description.trim()) return { success: false as const, error: 'Escribe una descripción' };
    try {
        const publication = await PublicationRepository.create(patternId, description.trim(), technique, imageUri);
        return { success: true as const, data: publication };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al publicar';
        return { success: false as const, error: message };
    }
}

// Elimina una publicación por id
async function remove(id: string) {
    try {
        await PublicationRepository.remove(id);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al eliminar';
        return { success: false as const, error: message };
    }
}

const PublicationUseCase = {
    loadFeed,
    create,
    remove,
};

export default PublicationUseCase;
