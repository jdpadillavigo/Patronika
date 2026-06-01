import ApiClient from '../../../core/data/networking/ApiClient';
import { createLoginRequest } from './dto/LoginRequestDto';
import { fromApiLoginResponse, type LoginResponseDto } from './dto/LoginResponseDto';
import { createRegisterRequest } from './dto/RegisterRequestDto';
import { fromApiRegisterResponse, type RegisterResponseDto } from './dto/RegisterResponseDto';

async function login(username: string, password: string): Promise<LoginResponseDto> {
    const requestDto = createLoginRequest(username, password);

    const rawResponse = await ApiClient.post(
        '/api/auth/login',
        requestDto as unknown as Record<string, unknown>,
        { requiresAuth: false },
    );

    return fromApiLoginResponse(rawResponse as { success: boolean; data?: { accessToken?: string; token?: string; refreshToken?: string }; message?: string });
}

async function register(username: string, email: string, password: string): Promise<RegisterResponseDto> {
    const requestDto = createRegisterRequest(username, email, password);

    const rawResponse = await ApiClient.post(
        '/api/auth/register',
        requestDto as unknown as Record<string, unknown>,
        { requiresAuth: false },
    );

    return fromApiRegisterResponse(rawResponse as { success: boolean; data?: string; message?: string });
}

async function logout(userId: string, refreshToken: string | null): Promise<void> {
    await ApiClient.post(`/api/auth/logout/${userId}`, {
        refreshToken: refreshToken || '',
    });
}

const AuthRemoteDataSource = {
    login,
    register,
    logout,
};

export default AuthRemoteDataSource;
