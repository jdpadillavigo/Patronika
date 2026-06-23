import { isSessionExpiredError } from '../../../../core/data/network/HttpClientExt';
import PatternRepository from '../../data/repositories/PatternRepository';

async function listMine() {
    try {
        const patterns = await PatternRepository.listMine();
        return { success: true, data: patterns };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true, data: [] };
        }

        const message = error instanceof Error ? error.message : 'Error al cargar patrones';
        return { success: false, error: message, data: [] };
    }
}

async function create(name: string, size: number, imageUri?: string | null) {
    if (!name.trim()) {
        return { success: false, error: 'Ingresa un nombre para el patrón' };
    }
    if (size < 1 || size > 100) {
        return { success: false, error: 'El tamaño debe estar entre 1 y 100' };
    }

    try {
        const pattern = await PatternRepository.create(name.trim(), size, imageUri);
        return { success: true, data: pattern };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }

        const message = error instanceof Error ? error.message : 'Error al crear el patrón';
        return { success: false, error: message };
    }
}

async function getById(id: string) {
    try {
        const pattern = await PatternRepository.getById(id);
        return { success: true as const, data: pattern };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al cargar el patrón';
        return { success: false as const, error: message, data: null };
    }
}

async function discard(id?: string | null) {
    if (!id) return { success: true };

    try {
        await PatternRepository.remove(id);
        return { success: true };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }

        const message = error instanceof Error ? error.message : 'Error al descartar el patrón';
        return { success: false, error: message };
    }
}

const PatternUseCase = {
    listMine,
    create,
    getById,
    discard,
};

export default PatternUseCase;
