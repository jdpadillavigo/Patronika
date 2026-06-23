import HttpClient from '../../../../core/data/network/HttpClientExt';
import type { Pattern } from '../../domain/models/Pattern';
import type { User } from '../../../../core/domain/models/User';
import PatternRemoteDataSource from '../networking/PatternRemoteDataSource';

async function listMine(): Promise<Pattern[]> {
    const user = await HttpClient.getCurrentUser<User>();
    if (!user?.id) {
        throw new Error('Inicia sesión nuevamente para ver tus patrones');
    }

    return PatternRemoteDataSource.loadByUser(user.id);
}

async function create(name: string, size: number, imageUri?: string | null): Promise<Pattern> {
    const user = await HttpClient.getCurrentUser<User>();
    if (!user?.id) {
        throw new Error('Inicia sesión nuevamente para crear patrones');
    }

    return PatternRemoteDataSource.create(user.id, name, size, imageUri);
}

async function getById(id: string) {
    return PatternRemoteDataSource.getById(id);
}

async function remove(id: string): Promise<void> {
    await PatternRemoteDataSource.remove(id);
}

const PatternRepository = {
    listMine,
    create,
    getById,
    remove,
};

export default PatternRepository;
