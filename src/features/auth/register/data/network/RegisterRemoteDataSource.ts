import HttpClient, { type ApiResponse } from '../../../../../core/data/network/HttpClientExt';
import type { User } from '../../../../../core/domain/models/User';
import { createUserRequest } from '../../../../../core/data/user/dto/UserDto';

function getBackendMessage(response: ApiResponse<unknown>, fallback: string): string {
    return typeof response.data === 'string' && response.data.trim() ? response.data : fallback;
}

async function register(
    username: string,
    email: string,
    password: string,
    profileImageUri?: string | null,
): Promise<User> {
    const formData = new FormData();
    formData.append('userRequest', {
        string: JSON.stringify(createUserRequest(username, email, password)),
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

    const response = await HttpClient.post<ApiResponse<User>>(
        '/api/auth/register',
        formData,
        { requiresAuth: false },
    );

    if (!response.data || typeof response.data === 'string') {
        throw new Error(getBackendMessage(response, 'No se pudo crear la cuenta'));
    }

    return response.data;
}

const RegisterRemoteDataSource = { register };

export default RegisterRemoteDataSource;
