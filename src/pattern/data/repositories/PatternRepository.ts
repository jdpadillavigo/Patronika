import ApiClient from '../../../core/data/networking/ApiClient';
import type { Pattern } from '../../domain/models/Pattern';
import type { User } from '../../domain/models/User';
import PatternRemoteDataSource from '../networking/PatternRemoteDataSource';

async function listMine(): Promise<Pattern[]> {
    const user = await ApiClient.getCurrentUser<User>();
    if (!user?.id) {
        throw new Error('Inicia sesión nuevamente para ver tus patrones');
    }

    return PatternRemoteDataSource.loadByUser(user.id);
}

async function create(name: string, size: number, imageUri?: string | null): Promise<Pattern> {
    const user = await ApiClient.getCurrentUser<User>();
    if (!user?.id) {
        throw new Error('Inicia sesión nuevamente para crear patrones');
    }

    return PatternRemoteDataSource.create(user.id, name, size, imageUri);
}

async function remove(id: string): Promise<void> {
    await PatternRemoteDataSource.remove(id);
}

const PatternRepository = {
    listMine,
    create,
    remove,
};

export default PatternRepository;
