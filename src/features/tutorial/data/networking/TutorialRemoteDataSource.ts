import HttpClient, { type ApiResponse } from '../../../../core/data/network/HttpClientExt';
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

async function getAll(): Promise<Tutorial[]> {
    const response = await HttpClient.get<ApiResponse<Tutorial[]>>('/api/tutorials');
    return assertApiSuccess(response, 'No se pudieron cargar los tutoriales') || [];
}

async function getById(id: string): Promise<Tutorial> {
    const response = await HttpClient.get<ApiResponse<Tutorial>>(`/api/tutorials/${id}`);
    const tutorial = assertApiSuccess(response, 'No se pudo cargar el tutorial');
    if (!tutorial) throw new Error('No se pudo cargar el tutorial');
    return tutorial;
}

async function create(request: TutorialRequest): Promise<Tutorial> {
    const response = await HttpClient.post<ApiResponse<Tutorial>>('/api/tutorials', request);
    const tutorial = assertApiSuccess(response, 'No se pudo crear el tutorial');
    if (!tutorial) throw new Error('No se pudo crear el tutorial');
    return tutorial;
}

async function update(id: string, request: TutorialRequest): Promise<void> {
    await HttpClient.put<ApiResponse<string>>(`/api/tutorials/${id}`, request);
}

async function remove(id: string): Promise<void> {
    await HttpClient.delete<ApiResponse<string>>(`/api/tutorials/${id}`);
}

const TutorialRemoteDataSource = {
    getAll,
    getById,
    create,
    update,
    remove,
};

export default TutorialRemoteDataSource;
