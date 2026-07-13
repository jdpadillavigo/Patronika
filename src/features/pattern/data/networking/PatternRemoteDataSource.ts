import HttpClient, { cacheAfterWrite, cachedRead, type ApiResponse } from '../../../../core/data/network/HttpClientExt';
import { createUser } from '../../../../core/domain/models/User';
import type { Pattern } from '../../domain/models/Pattern';
import { assertApiSuccess } from '../../../../core/data/network/dto/ApiResponseDto';

function getFileName(uri: string): string {
    return uri.split('/').pop() || `pattern-${Date.now()}.jpg`;
}

function getMimeType(uri: string): string {
    const extension = uri.split('.').pop()?.toLowerCase();
    if (extension === 'png') return 'image/png';
    if (extension === 'webp') return 'image/webp';
    return 'image/jpeg';
}

function toCachedPattern(pattern: Pattern): Pattern {
    const { user, ...data } = pattern;
    return { ...data, user: user ? createUser({ id: user.id, username: user.username }) : undefined };
}

async function loadByUser(userId: string, refresh = false): Promise<Pattern[]> {
    const route = `/api/patterns/user/${userId}`;
    return cachedRead(route, async () => {
        const response = await HttpClient.get<ApiResponse<Pattern[]>>(route);
        return (assertApiSuccess(response, 'No se pudieron cargar tus patrones') || []).map(toCachedPattern);
    }, { ttlMs: 120_000, refresh, collection: true });
}

async function create(userId: string, name: string, size: number, imageUri?: string | null): Promise<Pattern> {
    const formData = new FormData();

    formData.append('request', {
        string: JSON.stringify({ name, width: size, height: size }),
        type: 'application/json',
        name: 'request',
    } as unknown as Blob);

    if (imageUri) {
        formData.append('image', {
            uri: imageUri,
            name: getFileName(imageUri),
            type: getMimeType(imageUri),
        } as unknown as Blob);
    }

    return cacheAfterWrite(async () => {
        const response = await HttpClient.post<ApiResponse<Pattern>>(
            '/api/patterns',
            formData,
            { headers: { UserId: userId } },
        );
        const pattern = assertApiSuccess(response, 'No se pudo crear el patrón');
        if (!pattern) throw new Error('No se pudo crear el patrón');
        return pattern;
    }, async (cache, pattern) => {
        await cache.update<Pattern[]>(`/api/patterns/user/${userId}`, patterns =>
            [...patterns.filter(item => item.id !== pattern.id), toCachedPattern(pattern)],
        );
        await cache.invalidate(`/api/pattern-library/user/${userId}/all`);
    });
}

interface PatternDetail {
    id: string;
    name: string;
    gridData?: string | null;
    userId: string;
}

async function getById(id: string): Promise<PatternDetail> {
    const route = `/api/patterns/${id}`;
    return cachedRead(route, async () => {
        const response = await HttpClient.get<ApiResponse<PatternDetail>>(route);
        const data = assertApiSuccess(response, 'No se pudo cargar el patrón');
        if (!data) throw new Error('No se pudo cargar el patrón');
        const { id, name, gridData, userId } = data;
        return { id, name, gridData, userId };
    }, { ttlMs: 600_000 });
}

async function remove(id: string): Promise<void> {
    await cacheAfterWrite(
        () => HttpClient.delete<ApiResponse<string>>(`/api/patterns/${id}`),
        cache => cache.invalidate(`/api/patterns/${id}`, '/api/patterns/user', '/api/pattern-library/user', '/api/publications', '/api/comments'),
    );
}

const PatternRemoteDataSource = {
    loadByUser,
    create,
    getById,
    remove,
};

export default PatternRemoteDataSource;
