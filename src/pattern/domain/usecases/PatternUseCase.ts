import PatternRepository from '../../data/repositories/PatternRepository';

async function listMine() {
    try {
        const patterns = await PatternRepository.listMine();
        return { success: true, data: patterns };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al cargar patrones';
        return { success: false, error: message, data: [] };
    }
}

async function create(name: string, size: number, imageUri?: string | null) {
    if (!name.trim()) {
        return { success: false, error: 'Ingresa un nombre para el patron' };
    }
    if (size < 1 || size > 100) {
        return { success: false, error: 'El tamano debe estar entre 1 y 100' };
    }

    try {
        const pattern = await PatternRepository.create(name.trim(), size, imageUri);
        return { success: true, data: pattern };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al crear el patron';
        return { success: false, error: message };
    }
}

const PatternUseCase = {
    listMine,
    create,
};

export default PatternUseCase;
