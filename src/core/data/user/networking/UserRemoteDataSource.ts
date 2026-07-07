import HttpClient, { HttpResponseError, type ApiResponse } from '../../network/HttpClientExt';
import type { User } from '../../../domain/models/User';
import { assertApiSuccess } from '../../network/dto/ApiResponseDto';
import { createUserRequest, type UserRequestDto } from '../dto/UserDto';

export type UserRequest = UserRequestDto;

export interface SuspendUserRequest {
    adminId: string;
    days: number;
    reason: string;
}

export interface ReactivateUserRequest {
    adminId: string;
}

async function loadAll(): Promise<User[]> {
    const response = await HttpClient.get<ApiResponse<User[]>>('/api/users');
    return assertApiSuccess(response, 'No se pudieron cargar los usuarios') || [];
}

async function loadById(id: string): Promise<User> {
    const response = await HttpClient.get<ApiResponse<User>>(`/api/users/${id}`);
    const user = assertApiSuccess(response, 'Usuario no encontrado');
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    return user;
}

// PUT /api/users/{id} — actualiza datos del perfil (username, password, etc.)
// No acepta imagen; para subir foto usar uploadAvatar()
async function update(id: string, request: UserRequest): Promise<string> {
    const response = await HttpClient.put<ApiResponse<string>>(`/api/users/${id}`, request as unknown as Record<string, unknown>);
    return assertApiSuccess(response, 'Usuario actualizado correctamente') || 'Usuario actualizado correctamente';
}

async function create(
    username: string,
    email: string,
    password: string,
    profileImageUri?: string | null,
    isAdmin = false,
): Promise<User> {
    const formData = new FormData();
    formData.append('userRequest', {
        string: JSON.stringify(createUserRequest(username, email, password, { isAdmin })),
        type: 'application/json',
        name: 'userRequest',
    } as unknown as Blob);

    if (profileImageUri) {
        formData.append('file', {
            uri: profileImageUri,
            name: profileImageUri.split('/').pop() || `profile-${Date.now()}.jpg`,
            type: 'image/jpeg',
        } as unknown as Blob);
    }

    const response = await HttpClient.post<ApiResponse<User>>('/api/users', formData);
    const user = assertApiSuccess(response, 'No se pudo crear el usuario');
    if (!user) {
        throw new Error('No se pudo crear el usuario');
    }
    return user;
}

async function suspend(id: string, request: SuspendUserRequest): Promise<string> {
    const response = await HttpClient.post<ApiResponse<string>>(`/api/users/${id}/suspend`, request);
    return assertApiSuccess(response, 'Usuario suspendido correctamente') || 'Usuario suspendido correctamente';
}

async function reactivate(id: string, request: ReactivateUserRequest): Promise<string> {
    const response = await HttpClient.post<ApiResponse<string>>(`/api/users/${id}/reactivate`, request);
    return assertApiSuccess(response, 'Usuario reactivado correctamente') || 'Usuario reactivado correctamente';
}

async function remove(id: string, username: string): Promise<void> {
    try {
        await HttpClient.delete<ApiResponse<string>>(`/api/users/${id}`);
    } catch (error: unknown) {
        if (error instanceof HttpResponseError && (error.status === 404 || error.status === 405)) {
            await HttpClient.delete<ApiResponse<string>>(`/api/users/${id}/${encodeURIComponent(username)}`);
            return;
        }
        throw error;
    }
}

// PUT /api/users/{id}/profile-image — sube la foto de perfil del usuario.
// Usa multipart/form-data con la parte "file" conteniendo la imagen.
// Tras llamar a esta función, loadById() devolverá el profileImageUrl actualizado.
async function uploadAvatar(id: string, imageUri: string): Promise<string> {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || `avatar-${Date.now()}.jpg`;
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    formData.append('file', {
        uri: imageUri,
        name: filename,
        type: mimeType,
    } as unknown as Blob);
    const response = await HttpClient.put<ApiResponse<string>>(`/api/users/${id}/profile-image`, formData);
    return assertApiSuccess(response, 'Imagen de perfil actualizada correctamente') || 'Imagen de perfil actualizada correctamente';
}

async function changePassword(email: string, currentPassword: string, newPassword: string): Promise<string> {
    const response = await HttpClient.post<ApiResponse<string>>('/api/users/change-password', {
        email,
        currentPassword,
        newPassword,
    });
    return assertApiSuccess(response, 'Contraseña actualizada correctamente') || 'Contraseña actualizada correctamente';
}

const UserRemoteDataSource = {
    loadAll,
    loadById,
    create,
    update,
    suspend,
    reactivate,
    remove,
    uploadAvatar,
    changePassword,
};

export default UserRemoteDataSource;
