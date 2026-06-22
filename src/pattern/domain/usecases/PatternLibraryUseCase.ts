import { isSessionExpiredError } from '../../../core/data/networking/ApiClient';
import PatternLibraryRepository from '../../data/repositories/PatternLibraryRepository';

async function listSaved() {
    try {
        const data = await PatternLibraryRepository.listSaved();
        return { success: true as const, data };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true, data: [] };
        const message = error instanceof Error ? error.message : 'Error al cargar patrones guardados';
        return { success: false as const, error: message, data: [] };
    }
}

async function listAll() {
    try {
        const { patterns, currentUserId } = await PatternLibraryRepository.listAll();
        return { success: true as const, data: patterns, currentUserId };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false as const, sessionExpired: true, data: [], currentUserId: '' };
        }
        const message = error instanceof Error ? error.message : 'Error al cargar patrones';
        return { success: false as const, error: message, data: [], currentUserId: '' };
    }
}

async function save(patternId: string) {
    try {
        const entry = await PatternLibraryRepository.save(patternId);
        return { success: true as const, data: entry };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al guardar el patrón';
        return { success: false as const, error: message };
    }
}

async function remove(patternId: string) {
    try {
        await PatternLibraryRepository.remove(patternId);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al quitar el patrón guardado';
        return { success: false as const, error: message };
    }
}

const PatternLibraryUseCase = {
    listSaved,
    listAll,
    save,
    remove,
};

export default PatternLibraryUseCase;
