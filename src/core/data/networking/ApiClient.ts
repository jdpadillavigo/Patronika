import AsyncStorage from '@react-native-async-storage/async-storage';
import SessionExpiredService from '../../domain/session/SessionExpiredService';

const BASE_URL: string = process.env.EXPO_PUBLIC_API_URL || '';

const TOKEN_KEY = '@patronika_auth_token';
const REFRESH_TOKEN_KEY = '@patronika_refresh_token';
const CURRENT_USER_KEY = '@patronika_current_user';

interface RequestOptions {
    method?: string;
    body?: object | FormData | null;
    requiresAuth?: boolean;
    headers?: Record<string, string>;
    retryOnUnauthorized?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T | string | null;
}

export class SessionExpiredError extends Error {
    constructor() {
        super('Se le cerr\u00f3 la sesi\u00f3n por inactividad.');
        this.name = 'SessionExpiredError';
    }
}

export function isSessionExpiredError(error: unknown): boolean {
    return error instanceof SessionExpiredError
        || (error instanceof Error && error.name === 'SessionExpiredError');
}

interface RefreshTokenData {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
            throw new Error('No hay refresh token disponible');
        }

        const response = await request<ApiResponse<RefreshTokenData>>(
            '/api/auth/refresh',
            {
                method: 'POST',
                body: { refreshToken },
                requiresAuth: false,
                retryOnUnauthorized: false,
            },
        );

        const data = response.data && typeof response.data !== 'string' ? response.data : null;
        const accessToken = data?.accessToken || data?.token || '';
        const nextRefreshToken = data?.refreshToken || refreshToken;

        if (!response.success || !accessToken) {
            throw new Error('No se pudo renovar la sesion');
        }

        await saveTokens(accessToken, nextRefreshToken);
        return accessToken;
    })().finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
}

async function expireSession(): Promise<void> {
    await clearSession();
    SessionExpiredService.notify();
}

async function request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
        method = 'GET',
        body = null,
        requiresAuth = true,
        headers = {},
        retryOnUnauthorized = true,
    } = options;

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const requestHeaders: Record<string, string> = { ...headers };

    if (!isFormData) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    if (requiresAuth) {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
            requestHeaders.Authorization = `Bearer ${token}`;
        }
    }

    const config: RequestInit = {
        method,
        headers: requestHeaders,
    };

    if (body) {
        config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok) {
            if (response.status === 401 && requiresAuth) {
                if (retryOnUnauthorized) {
                    try {
                        const nextAccessToken = await refreshAccessToken();
                        return request<T>(endpoint, {
                            ...options,
                            headers: {
                                ...headers,
                                Authorization: `Bearer ${nextAccessToken}`,
                            },
                            retryOnUnauthorized: false,
                        });
                    } catch {
                        await expireSession();
                        throw new SessionExpiredError();
                    }
                }

                await expireSession();
                throw new SessionExpiredError();
            }

            const errorData = data as Record<string, unknown> | null;
            const errorMessage = typeof errorData?.data === 'string'
                ? errorData.data
                : 'Error en la solicitud';
            throw new Error(errorMessage);
        }

        if (data && typeof data === 'object' && 'success' in data && data.success === false) {
            const apiResponse = data as ApiResponse<unknown>;
            const errorMessage = typeof apiResponse.data === 'string' && apiResponse.data.trim()
                ? apiResponse.data
                : 'Error en la solicitud';
            throw new Error(errorMessage);
        }

        return data as T;
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Network request failed') {
            throw new Error('Sin conexion a internet. Verifica tu conexion e intenta de nuevo.');
        }
        throw error;
    }
}

function get<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
}

function post<T = unknown>(endpoint: string, body: object | FormData, options: RequestOptions = {}): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body });
}

function put<T = unknown>(endpoint: string, body: object | FormData, options: RequestOptions = {}): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
}

function del<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
}

async function saveTokens(accessToken: string, refreshToken?: string | null): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

async function getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
}

async function getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

async function clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
}

async function saveCurrentUser(user: unknown): Promise<void> {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

async function getCurrentUser<T = unknown>(): Promise<T | null> {
    const stored = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) as T : null;
}

async function clearCurrentUser(): Promise<void> {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

async function clearSession(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, CURRENT_USER_KEY]);
}

const ApiClient = {
    get,
    post,
    put,
    delete: del,
    saveTokens,
    getAccessToken,
    getRefreshToken,
    clearTokens,
    saveCurrentUser,
    getCurrentUser,
    clearCurrentUser,
    clearSession,
    BASE_URL,
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    CURRENT_USER_KEY,
};

export default ApiClient;
