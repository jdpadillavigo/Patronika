import ApiClient, { type ApiResponse } from '../../../core/data/networking/ApiClient';
import type { User } from '../../domain/models/User';
import {
    createAuthRequest,
    createRefreshTokenRequest,
    createVerificationCodeRequest,
    createVerifyCodeRequest,
    type AuthTokensDto,
} from './dto/AuthDto';
import { createUserRequest } from './dto/UserDto';

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

function getBackendMessage(response: ApiResponse<unknown>, fallback: string): string {
    return typeof response.data === 'string' && response.data.trim()
        ? response.data
        : fallback;
}

function readTokens(response: ApiResponse<AuthTokensDto>): TokenPair {
    const data = typeof response.data === 'string' ? null : response.data;
    const accessToken = data?.accessToken || data?.token || '';
    const refreshToken = data?.refreshToken || '';

    if (!response.success || !accessToken) {
        throw new Error(getBackendMessage(response, 'No se pudo autenticar la sesión'));
    }

    return { accessToken, refreshToken };
}

async function login(username: string, password: string): Promise<TokenPair> {
    const response = await ApiClient.post<ApiResponse<AuthTokensDto>>(
        '/api/auth/login',
        createAuthRequest(username, password),
        { requiresAuth: false },
    );

    return readTokens(response);
}

async function requestRegisterCode(email: string): Promise<string> {
    const response = await ApiClient.post<ApiResponse<string>>(
        '/api/auth/register/request-code',
        createVerificationCodeRequest(email),
        { requiresAuth: false },
    );

    return typeof response.data === 'string' && response.data.trim()
        ? response.data
        : 'Código enviado al correo';
}

async function requestPasswordRecoveryCode(email: string): Promise<string> {
    const response = await ApiClient.post<ApiResponse<string>>(
        '/api/auth/change-password/request-code',
        createVerificationCodeRequest(email),
        { requiresAuth: false },
    );

    return typeof response.data === 'string' && response.data.trim()
        ? response.data
        : 'Código enviado al correo';
}

async function verifyCode(email: string, code: string): Promise<string> {
    const response = await ApiClient.post<ApiResponse<string>>(
        '/api/auth/verify-code',
        createVerifyCodeRequest(email, code),
        { requiresAuth: false },
    );

    return typeof response.data === 'string' && response.data.trim()
        ? response.data
        : 'Código verificado correctamente';
}

async function register(username: string, email: string, password: string, profileImageUri?: string | null): Promise<User> {
    const formData = new FormData();

    // Spring Boot @RequestPart necesita Content-Type: application/json para deserializar el objeto.
    // React Native envía strings como text/plain, así que usamos el formato { string, type, name }
    // que el XHR de React Native convierte a un part con el Content-Type correcto.
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

    const response = await ApiClient.post<ApiResponse<User>>(
        '/api/auth/register',
        formData,
        { requiresAuth: false },
    );

    if (!response.data || typeof response.data === 'string') {
        throw new Error(getBackendMessage(response, 'No se pudo crear la cuenta'));
    }

    return response.data;
}

async function refresh(refreshToken: string): Promise<TokenPair> {
    const response = await ApiClient.post<ApiResponse<AuthTokensDto>>(
        '/api/auth/refresh',
        createRefreshTokenRequest(refreshToken),
        { requiresAuth: false },
    );

    return readTokens(response);
}

async function logout(userId: string, refreshToken: string): Promise<void> {
    await ApiClient.post<ApiResponse<string>>(
        `/api/auth/logout/${userId}`,
        createRefreshTokenRequest(refreshToken),
    );
}

const AuthRemoteDataSource = {
    login,
    requestRegisterCode,
    requestPasswordRecoveryCode,
    verifyCode,
    register,
    refresh,
    logout,
};

export default AuthRemoteDataSource;
