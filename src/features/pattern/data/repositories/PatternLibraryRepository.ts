import HttpClient from '../../../../core/data/network/HttpClientExt';
import type { User } from '../../../../core/domain/models/User';
import PatternLibraryRemoteDataSource, {
    type LibraryEntry,
    type LibraryPattern,
} from '../networking/PatternLibraryRemoteDataSource';

async function listSaved(refresh = false): Promise<LibraryEntry[]> {
    const user = await HttpClient.getCurrentUser<User>();
    if (!user?.id) throw new Error('Inicia sesión nuevamente');
    return PatternLibraryRemoteDataSource.getSaved(user.id, refresh);
}

async function listAll(refresh = false): Promise<{ patterns: LibraryPattern[]; currentUserId: string }> {
    const user = await HttpClient.getCurrentUser<User>();
    if (!user?.id) throw new Error('Inicia sesión nuevamente');
    const patterns = await PatternLibraryRemoteDataSource.getAll(user.id, refresh);
    return { patterns, currentUserId: user.id };
}

async function save(patternId: string): Promise<LibraryEntry> {
    const user = await HttpClient.getCurrentUser<User>();
    if (!user?.id) throw new Error('Inicia sesión nuevamente');
    return PatternLibraryRemoteDataSource.save(user.id, patternId);
}

async function remove(patternId: string): Promise<void> {
    const user = await HttpClient.getCurrentUser<User>();
    if (!user?.id) throw new Error('Inicia sesión nuevamente');
    await PatternLibraryRemoteDataSource.remove(user.id, patternId);
}

const PatternLibraryRepository = {
    listSaved,
    listAll,
    save,
    remove,
};

export default PatternLibraryRepository;
