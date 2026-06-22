import ApiClient, { type ApiResponse } from '../../../core/data/networking/ApiClient';
import type { Pattern } from '../../domain/models/Pattern';
import { assertApiSuccess } from './dto/ApiResponseDto';

function getFileName(uri: string): string {
    return uri.split('/').pop() || `pattern-${Date.now()}.jpg`;
}

function getMimeType(uri: string): string {
    const extension = uri.split('.').pop()?.toLowerCase();
    if (extension === 'png') return 'image/png';
    if (extension === 'webp') return 'image/webp';
    return 'image/jpeg';
}

async function loadByUser(userId: string): Promise<Pattern[]> {
    const response = await ApiClient.get<ApiResponse<Pattern[]>>(`/api/patterns/user/${userId}`);
    return assertApiSuccess(response, 'No se pudieron cargar tus patrones') || [];
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

    const response = await ApiClient.post<ApiResponse<Pattern>>(
        '/api/patterns',
        formData,
        { headers: { UserId: userId } },
    );

    if (!response.data) {
        assertApiSuccess(response, 'No se pudo crear el patrón');
        throw new Error('No se pudo crear el patrón');
    }

    return response.data as Pattern;
}

async function getById(id: string): Promise<{ id: string; name: string; gridData?: string | null; userId: string }> {
    const response = await ApiClient.get<ApiResponse<{ id: string; name: string; gridData?: string | null; userId: string }>>(`/api/patterns/${id}`);
    const data = assertApiSuccess(response, 'No se pudo cargar el patrón');
    if (!data) throw new Error('No se pudo cargar el patrón');
    return data;
}

async function remove(id: string): Promise<void> {
    await ApiClient.delete<ApiResponse<string>>(`/api/patterns/${id}`);
}

const PatternRemoteDataSource = {
    loadByUser,
    create,
    getById,
    remove,
};

export default PatternRemoteDataSource;
