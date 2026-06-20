import ApiClient, { type ApiResponse } from '../../../core/data/networking/ApiClient';
import type { User } from '../../domain/models/User';
import { assertApiSuccess } from './dto/ApiResponseDto';
import type { UserRequestDto } from './dto/UserDto';

export type UserRequest = UserRequestDto;

async function loadAll(): Promise<User[]> {
    const response = await ApiClient.get<ApiResponse<User[]>>('/api/users');
    return assertApiSuccess(response, 'No se pudieron cargar los usuarios') || [];
}

async function loadById(id: string): Promise<User> {
    const response = await ApiClient.get<ApiResponse<User>>(`/api/users/${id}`);
    const user = assertApiSuccess(response, 'Usuario no encontrado');
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    return user;
}

// PUT /api/users/{id} — actualiza datos del perfil (username, password, etc.)
// No acepta imagen; para subir foto usar uploadAvatar()
async function update(id: string, request: UserRequest): Promise<void> {
    await ApiClient.put<ApiResponse<string>>(`/api/users/${id}`, request as unknown as Record<string, unknown>);
}

// PUT /api/users/{id}/profile-image — sube la foto de perfil del usuario.
// Usa multipart/form-data con la parte "file" conteniendo la imagen.
// Tras llamar a esta función, loadById() devolverá el profileImageUrl actualizado.
async function uploadAvatar(id: string, imageUri: string): Promise<void> {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || `avatar-${Date.now()}.jpg`;
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    formData.append('file', {
        uri: imageUri,
        name: filename,
        type: mimeType,
    } as unknown as Blob);
    await ApiClient.put<ApiResponse<unknown>>(`/api/users/${id}/profile-image`, formData);
}

const UserRemoteDataSource = {
    loadAll,
    loadById,
    update,
    uploadAvatar,
};

export default UserRemoteDataSource;
