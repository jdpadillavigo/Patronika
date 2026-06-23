import HttpClient, { type ApiResponse } from '../../../../../core/data/network/HttpClientExt';
import {
    createLoginRequest,
    createRefreshTokenRequest,
    type AuthTokensDto,
} from './dto/LoginDto';

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

function getBackendMessage(response: ApiResponse<unknown>, fallback: string): string {
    return typeof response.data === 'string' && response.data.trim() ? response.data : fallback;
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
    const response = await HttpClient.post<ApiResponse<AuthTokensDto>>(
        '/api/auth/login',
        createLoginRequest(username, password),
        { requiresAuth: false },
    );
    return readTokens(response);
}

async function refresh(refreshToken: string): Promise<TokenPair> {
    const response = await HttpClient.post<ApiResponse<AuthTokensDto>>(
        '/api/auth/refresh',
        createRefreshTokenRequest(refreshToken),
        { requiresAuth: false },
    );
    return readTokens(response);
}

async function logout(userId: string, refreshToken: string): Promise<void> {
    await HttpClient.post<ApiResponse<string>>(
        `/api/auth/logout/${userId}`,
        createRefreshTokenRequest(refreshToken),
    );
}

const LoginRemoteDataSource = { login, refresh, logout };

export default LoginRemoteDataSource;
