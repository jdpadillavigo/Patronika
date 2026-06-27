import { isSessionExpiredError } from '../../../core/data/networking/ApiClient';
import TutorialRepository from '../../data/repositories/TutorialRepository';

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

const TutorialUseCase = {
    getAll,
};

export default TutorialUseCase;
