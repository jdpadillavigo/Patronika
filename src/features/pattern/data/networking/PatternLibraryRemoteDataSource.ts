import HttpClient, { cacheAfterWrite, cachedRead, type ApiResponse } from '../../../../core/data/network/HttpClientExt';
import { assertApiSuccess } from '../../../../core/data/network/dto/ApiResponseDto';

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

function savedRoute(userId: string): string {
    return `/api/pattern-library/user/${userId}`;
}

async function getSaved(userId: string, refresh = false): Promise<LibraryEntry[]> {
    const route = savedRoute(userId);
    return cachedRead(route, async () => {
        const response = await HttpClient.get<ApiResponse<LibraryEntry[]>>(route);
        return assertApiSuccess(response, 'No se pudieron cargar los patrones guardados') || [];
    }, { ttlMs: 120_000, refresh, collection: true });
}

async function getAll(userId: string, refresh = false): Promise<LibraryPattern[]> {
    const route = `${savedRoute(userId)}/all`;
    return cachedRead(route, async () => {
        const response = await HttpClient.get<ApiResponse<LibraryPattern[]>>(route);
        return assertApiSuccess(response, 'No se pudieron cargar los patrones') || [];
    }, { ttlMs: 120_000, refresh, collection: true });
}

async function save(userId: string, patternId: string): Promise<LibraryEntry> {
    return cacheAfterWrite(async () => {
        const response = await HttpClient.post<ApiResponse<LibraryEntry>>('/api/pattern-library', { userId, patternId });
        const entry = assertApiSuccess(response, 'No se pudo guardar el patrón');
        if (!entry) throw new Error('No se pudo guardar el patrón');
        return entry;
    }, async (cache, entry) => {
        const route = savedRoute(userId);
        if (!entry.pattern?.id) {
            await cache.invalidate(route);
            return;
        }
        await Promise.all([
            cache.update<LibraryEntry[]>(route, entries =>
                [...entries.filter(item => item.pattern.id !== patternId), entry],
            ),
            cache.update<LibraryPattern[]>(`${route}/all`, patterns =>
                [...patterns.filter(pattern => pattern.id !== patternId), entry.pattern],
            ),
        ]);
    });
}

async function remove(userId: string, patternId: string): Promise<void> {
    await cacheAfterWrite(
        () => HttpClient.delete<ApiResponse<string>>('/api/pattern-library', { body: { userId, patternId } }),
        async cache => {
            const route = savedRoute(userId);
            await Promise.all([
                cache.update<LibraryEntry[]>(route, entries => entries.filter(entry => entry.pattern.id !== patternId)),
                cache.update<LibraryPattern[]>(`${route}/all`, patterns =>
                    patterns.filter(pattern => pattern.id !== patternId || pattern.userId === userId),
                ),
            ]);
        },
    );
}

const PatternLibraryRemoteDataSource = {
    getSaved,
    getAll,
    save,
    remove,
};

export default PatternLibraryRemoteDataSource;
