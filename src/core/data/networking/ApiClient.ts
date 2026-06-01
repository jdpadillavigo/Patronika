import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL: string = process.env.EXPO_PUBLIC_API_URL || '';

const TOKEN_KEY = '@patronika_auth_token';
const REFRESH_TOKEN_KEY = '@patronika_refresh_token';
const CURRENT_USER_KEY = '@patronika_current_user';

interface RequestOptions {
    method?: string;
    body?: Record<string, unknown> | FormData | null;
    requiresAuth?: boolean;
    headers?: Record<string, string>;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

async function request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
        method = 'GET',
        body = null,
        requiresAuth = true,
        headers = {},
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
        console.log(data);
        if (!response.ok) {
            const errorData = data as Record<string, unknown> | null;
            const errorMessage = (errorData?.data as string) || (errorData?.message as string) || 'Error en la solicitud';
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

function post<T = unknown>(endpoint: string, body: Record<string, unknown> | FormData, options: RequestOptions = {}): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body });
}

function put<T = unknown>(endpoint: string, body: Record<string, unknown> | FormData, options: RequestOptions = {}): Promise<T> {
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
