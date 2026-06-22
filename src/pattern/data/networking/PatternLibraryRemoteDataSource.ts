import ApiClient, { type ApiResponse } from '../../../core/data/networking/ApiClient';
import { assertApiSuccess } from './dto/ApiResponseDto';

export interface LibraryPattern {
    id: string;
    userId: string;
    name: string;
    gridData?: string | null;
    width: number;
    height: number;
    isPublic: boolean;
    publishedAt?: string | null;
    createdAt: string;
}

export interface LibraryEntry {
    id: string;
    userId: string;
    pattern: LibraryPattern;
    savedAt: string;
}

async function getSaved(userId: string): Promise<LibraryEntry[]> {
    const response = await ApiClient.get<ApiResponse<LibraryEntry[]>>(`/api/pattern-library/user/${userId}`);
    return assertApiSuccess(response, 'No se pudieron cargar los patrones guardados') || [];
}

async function getAll(userId: string): Promise<LibraryPattern[]> {
    const response = await ApiClient.get<ApiResponse<LibraryPattern[]>>(`/api/pattern-library/user/${userId}/all`);
    return assertApiSuccess(response, 'No se pudieron cargar los patrones') || [];
}

async function save(userId: string, patternId: string): Promise<LibraryEntry> {
    const response = await ApiClient.post<ApiResponse<LibraryEntry>>('/api/pattern-library', { userId, patternId });
    const entry = assertApiSuccess(response, 'No se pudo guardar el patrón');
    if (!entry) throw new Error('No se pudo guardar el patrón');
    return entry;
}

async function remove(userId: string, patternId: string): Promise<void> {
    await ApiClient.delete<ApiResponse<string>>('/api/pattern-library', { body: { userId, patternId } });
}

const PatternLibraryRemoteDataSource = {
    getSaved,
    getAll,
    save,
    remove,
};

export default PatternLibraryRemoteDataSource;
