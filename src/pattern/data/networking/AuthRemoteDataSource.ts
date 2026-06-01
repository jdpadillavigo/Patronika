import ApiClient, { type ApiResponse } from '../../../core/data/networking/ApiClient';

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

function readTokens(response: ApiResponse<Record<string, string>>): TokenPair {
    const accessToken = response.data?.accessToken || response.data?.token || '';
    const refreshToken = response.data?.refreshToken || '';

    if (!response.success || !accessToken) {
        throw new Error(response.message || 'No se pudo autenticar la sesion');
    }

    return { accessToken, refreshToken };
}

async function login(username: string, password: string): Promise<TokenPair> {
    const response = await ApiClient.post<ApiResponse<Record<string, string>>>(
        '/api/auth/login',
        { username, password },
        { requiresAuth: false },
    );

    return readTokens(response);
}

async function requestRegisterCode(email: string): Promise<string> {
    const response = await ApiClient.post<ApiResponse<string>>(
        '/api/auth/register/request-code',
        { email },
        { requiresAuth: false },
    );

    return response.data || 'Codigo enviado al correo';
}

async function verifyRegisterCode(email: string, code: string): Promise<string> {
    const response = await ApiClient.post<ApiResponse<Record<string, string>>>(
        '/api/auth/register/verify-code',
        { email, code },
        { requiresAuth: false },
    );

    const verificationToken = response.data?.verificationToken || '';
    if (!response.success || !verificationToken) {
        throw new Error(response.message || 'No se pudo verificar el codigo');
    }

    return verificationToken;
}

async function register(verificationToken: string, username: string, email: string, password: string): Promise<TokenPair> {
    const response = await ApiClient.post<ApiResponse<Record<string, string>>>(
        '/api/auth/register',
        {
            verificationToken,
            user: {
                username,
                email,
                password,
                isAdmin: false,
                status: 0,
                activateNotification: true,
                suspensionEndDate: null,
            },
        },
        { requiresAuth: false },
    );

    return readTokens(response);
}

async function refresh(refreshToken: string): Promise<TokenPair> {
    const response = await ApiClient.post<ApiResponse<Record<string, string>>>(
        '/api/auth/refresh',
        { refreshToken },
        { requiresAuth: false },
    );

    return readTokens(response);
}

async function logout(userId: string, refreshToken: string): Promise<void> {
    await ApiClient.post<ApiResponse<string>>(`/api/auth/logout/${userId}`, { refreshToken });
}

const AuthRemoteDataSource = {
    login,
    requestRegisterCode,
    verifyRegisterCode,
    register,
    refresh,
    logout,
};

export default AuthRemoteDataSource;
