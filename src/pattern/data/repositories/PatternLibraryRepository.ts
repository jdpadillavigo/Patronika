import ApiClient from '../../../core/data/networking/ApiClient';
import type { User } from '../../domain/models/User';
import PatternLibraryRemoteDataSource, {
    type LibraryEntry,
    type LibraryPattern,
} from '../networking/PatternLibraryRemoteDataSource';

async function listSaved(): Promise<LibraryEntry[]> {
    const user = await ApiClient.getCurrentUser<User>();
    if (!user?.id) throw new Error('Inicia sesión nuevamente');
    return PatternLibraryRemoteDataSource.getSaved(user.id);
}

async function listAll(): Promise<{ patterns: LibraryPattern[]; currentUserId: string }> {
    const user = await ApiClient.getCurrentUser<User>();
    if (!user?.id) throw new Error('Inicia sesión nuevamente');
    const patterns = await PatternLibraryRemoteDataSource.getAll(user.id);
    return { patterns, currentUserId: user.id };
}

async function save(patternId: string): Promise<LibraryEntry> {
    const user = await ApiClient.getCurrentUser<User>();
    if (!user?.id) throw new Error('Inicia sesión nuevamente');
    return PatternLibraryRemoteDataSource.save(user.id, patternId);
}

async function remove(patternId: string): Promise<void> {
    const user = await ApiClient.getCurrentUser<User>();
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
