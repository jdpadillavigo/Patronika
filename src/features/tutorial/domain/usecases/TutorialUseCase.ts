import { isSessionExpiredError } from '../../../../core/data/network/HttpClientExt';
import TutorialRepository from '../../data/repositories/TutorialRepository';

const INVALID_SOURCE_MESSAGE = 'No se permite videos de esa fuente ingresada';

function normalizeUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return trimmed;
    return /^https:\/\//i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^https?:\/\//i, '')}`;
}

function getYouTubeId(url: string): string | null {
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#/]+)/i,
    );
    return match ? match[1] : null;
}

function getAllowedVideoSource(url: string) {
    const normalizedUrl = normalizeUrl(url);
    const youtubeId = getYouTubeId(normalizedUrl);
    if (youtubeId) {
        return {
            type: 'youtube' as const,
            embedUrl: `https://www.youtube.com/embed/${youtubeId}?playsinline=1&controls=1&rel=0&modestbranding=1&origin=https://com.patronika`,
            thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        };
    }

    return null;
}

function validateDraft(title: string, description: string, url: string) {
    if (!title.trim()) return 'Ingresa el título del tutorial';
    if (!description.trim()) return 'Ingresa la descripción del tutorial';
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl || !/^https:\/\/.+/i.test(normalizedUrl)) return 'Ingresa una URL válida que empiece con https://';
    if (!getAllowedVideoSource(normalizedUrl)) return INVALID_SOURCE_MESSAGE;
    return null;
}

async function getAll() {
    try {
        const tutorials = await TutorialRepository.getAll();
        return { success: true as const, data: tutorials };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true, data: [] };
        const message = error instanceof Error ? error.message : 'Error al cargar tutoriales';
        return { success: false as const, error: message, data: [] };
    }
}

async function getById(id: string) {
    try {
        const tutorial = await TutorialRepository.getById(id);
        return { success: true as const, data: tutorial };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al cargar tutorial';
        return { success: false as const, error: message };
    }
}

async function create(title: string, description: string, url: string) {
    const validation = validateDraft(title, description, url);
    if (validation) return { success: false as const, error: validation };

    try {
        const tutorial = await TutorialRepository.create({
            title: title.trim(),
            description: description.trim(),
            url: normalizeUrl(url),
        });
        return { success: true as const, data: tutorial };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al crear tutorial';
        return { success: false as const, error: message };
    }
}

async function update(id: string, title: string, description: string, url: string) {
    const validation = validateDraft(title, description, url);
    if (validation) return { success: false as const, error: validation };

    try {
        await TutorialRepository.update(id, {
            title: title.trim(),
            description: description.trim(),
            url: normalizeUrl(url),
        });
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al actualizar tutorial';
        return { success: false as const, error: message };
    }
}

async function remove(id: string) {
    try {
        await TutorialRepository.remove(id);
        return { success: true as const };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) return { success: false as const, sessionExpired: true };
        const message = error instanceof Error ? error.message : 'Error al eliminar tutorial';
        return { success: false as const, error: message };
    }
}

const TutorialUseCase = {
    getAll,
    getById,
    create,
    update,
    remove,
    normalizeUrl,
    getAllowedVideoSource,
};

export default TutorialUseCase;
