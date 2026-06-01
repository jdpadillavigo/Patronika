import ApiClient, { type ApiResponse } from '../../../core/data/networking/ApiClient';
import type { Pattern } from '../../domain/models/Pattern';

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
    return response.data || [];
}

async function create(userId: string, name: string, size: number, imageUri?: string | null): Promise<Pattern> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('size', String(size));

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
        throw new Error('No se pudo crear el patron');
    }

    return response.data;
}

const PatternRemoteDataSource = {
    loadByUser,
    create,
};

export default PatternRemoteDataSource;
