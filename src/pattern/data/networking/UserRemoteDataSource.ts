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

async function update(id: string, request: UserRequest): Promise<void> {
    await ApiClient.put<ApiResponse<string>>(`/api/users/${id}`, request as unknown as Record<string, unknown>);
}

const UserRemoteDataSource = {
    loadAll,
    loadById,
    update,
};

export default UserRemoteDataSource;
