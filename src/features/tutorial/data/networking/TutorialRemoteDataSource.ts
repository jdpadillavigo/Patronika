import HttpClient, { cacheAfterWrite, cachedRead, type ApiResponse } from '../../../../core/data/network/HttpClientExt';
import { assertApiSuccess } from '../../../../core/data/network/dto/ApiResponseDto';

export interface Tutorial {
    id: string;
    title: string;
    description: string;
    url: string;
}

export interface TutorialRequest {
    title: string;
    description: string;
    url: string;
}

const TUTORIALS = '/api/tutorials';

async function getAll(refresh = false): Promise<Tutorial[]> {
    return cachedRead(TUTORIALS, async () => {
        const response = await HttpClient.get<ApiResponse<Tutorial[]>>(TUTORIALS);
        return assertApiSuccess(response, 'No se pudieron cargar los tutoriales') || [];
    }, { ttlMs: 600_000, refresh, collection: true });
}

async function getById(id: string): Promise<Tutorial> {
    const route = `${TUTORIALS}/${id}`;
    return cachedRead(route, async () => {
        const response = await HttpClient.get<ApiResponse<Tutorial>>(route);
        const tutorial = assertApiSuccess(response, 'No se pudo cargar el tutorial');
        if (!tutorial) throw new Error('No se pudo cargar el tutorial');
        return tutorial;
    }, { ttlMs: 600_000 });
}

async function create(request: TutorialRequest): Promise<Tutorial> {
    return cacheAfterWrite(async () => {
        const response = await HttpClient.post<ApiResponse<Tutorial>>(TUTORIALS, request);
        const tutorial = assertApiSuccess(response, 'No se pudo crear el tutorial');
        if (!tutorial) throw new Error('No se pudo crear el tutorial');
        return tutorial;
    }, (cache, tutorial) => cache.update<Tutorial[]>(TUTORIALS, tutorials =>
        [...tutorials.filter(item => item.id !== tutorial.id), tutorial],
    ));
}

async function update(id: string, request: TutorialRequest): Promise<void> {
    const route = `${TUTORIALS}/${id}`;
    await cacheAfterWrite(
        () => HttpClient.put<ApiResponse<string>>(route, request),
        async cache => {
            await Promise.all([
                cache.update<Tutorial>(route, tutorial => ({ ...tutorial, ...request })),
                cache.update<Tutorial[]>(TUTORIALS, tutorials =>
                    tutorials.map(tutorial => tutorial.id === id ? { ...tutorial, ...request } : tutorial),
                ),
            ]);
        },
    );
}

async function remove(id: string): Promise<void> {
    const route = `${TUTORIALS}/${id}`;
    await cacheAfterWrite(
        () => HttpClient.delete<ApiResponse<string>>(route),
        async cache => {
            await Promise.all([
                cache.invalidate(route),
                cache.update<Tutorial[]>(TUTORIALS, tutorials => tutorials.filter(tutorial => tutorial.id !== id)),
            ]);
        },
    );
}

const TutorialRemoteDataSource = {
    getAll,
    getById,
    create,
    update,
    remove,
};

export default TutorialRemoteDataSource;
