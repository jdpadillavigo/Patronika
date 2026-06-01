import ApiClient, { type ApiResponse } from '../../../core/data/networking/ApiClient';
import type { User } from '../../domain/models/User';

export interface UserRequest {
    username: string;
    email: string;
    password?: string;
    isAdmin: boolean;
    status: number;
    activateNotification: boolean;
    suspensionEndDate: string | null;
}

async function loadAll(): Promise<User[]> {
    const response = await ApiClient.get<ApiResponse<User[]>>('/api/users');
    return response.data || [];
}

async function loadById(id: string): Promise<User> {
    const response = await ApiClient.get<ApiResponse<User>>(`/api/users/${id}`);
    if (!response.data) {
        throw new Error('Usuario no encontrado');
    }
    return response.data;
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
