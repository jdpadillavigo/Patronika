import AsyncStorage from '@react-native-async-storage/async-storage';

import SessionExpiredService from '../../domain/session/SessionExpiredService';
import HttpClientFactory, { HttpTimeoutError } from './HttpClientFactory';

export const BASE_URL: string = process.env.EXPO_PUBLIC_API_URL || '';

export const TOKEN_KEY = '@patronika_auth_token';
export const REFRESH_TOKEN_KEY = '@patronika_refresh_token';
export const CURRENT_USER_KEY = '@patronika_current_user';

export interface RequestOptions {
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

interface RefreshTokenData {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
}

export class SessionExpiredError extends Error {
    constructor() {
        super('Se le cerró la sesión por inactividad.');
        this.name = 'SessionExpiredError';
    }
}

export class HttpResponseError extends Error {
    constructor(public readonly status: number, message: string) {
        super(message);
        this.name = 'HttpResponseError';
    }
}

export function isSessionExpiredError(error: unknown): boolean {
    return error instanceof SessionExpiredError
        || (error instanceof Error && error.name === 'SessionExpiredError');
}

export function constructRoute(route: string): string {
    if (/^https?:\/\//i.test(route)) return route;
    if (route.startsWith('/')) return `${BASE_URL}${route}`;
    return `${BASE_URL}/${route}`;
}

const transport = HttpClientFactory.create();
let refreshPromise: Promise<string> | null = null;

async function readBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function getErrorMessage(data: unknown, fallback: string): string {
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object' && 'data' in data) {
        const value = (data as { data?: unknown }).data;
        if (typeof value === 'string' && value.trim()) return value;
    }
    return fallback;
}

export async function responseToResult<T>(response: Response): Promise<T> {
    const data = await readBody(response);

    if (!response.ok) {
        const fallback = response.status >= 500
            ? 'El servidor no pudo completar la solicitud.'
            : 'Error en la solicitud.';
        throw new HttpResponseError(response.status, getErrorMessage(data, fallback));
    }

    if (data && typeof data === 'object' && 'success' in data && data.success === false) {
        throw new HttpResponseError(response.status, getErrorMessage(data, 'Error en la solicitud.'));
    }

    return data as T;
}

export async function safeCall<T>(execute: () => Promise<T>): Promise<T> {
    try {
        return await execute();
    } catch (error: unknown) {
        if (error instanceof HttpTimeoutError || error instanceof HttpResponseError || isSessionExpiredError(error)) {
            throw error;
        }

        if (error instanceof TypeError || (error instanceof Error && error.message === 'Network request failed')) {
            throw new Error('Sin conexión a internet. Verifica tu conexión e intenta de nuevo.');
        }

        throw error instanceof Error ? error : new Error('Ocurrió un error inesperado.');
    }
}

async function refreshAccessToken(): Promise<string> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) throw new Error('No hay refresh token disponible');

        const response = await request<ApiResponse<RefreshTokenData>>('/api/auth/refresh', {
            method: 'POST',
            body: { refreshToken },
            requiresAuth: false,
            retryOnUnauthorized: false,
        });
        const data = response.data && typeof response.data !== 'string' ? response.data : null;
        const accessToken = data?.accessToken || data?.token || '';
        const nextRefreshToken = data?.refreshToken || refreshToken;

        if (!response.success || !accessToken) throw new Error('No se pudo renovar la sesión');

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

export async function request<T = unknown>(route: string, options: RequestOptions = {}): Promise<T> {
    const {
        method = 'GET',
        body = null,
        requiresAuth = true,
        headers = {},
        retryOnUnauthorized = true,
    } = options;

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const requestHeaders: Record<string, string> = { ...headers };

    if (!isFormData) requestHeaders['Content-Type'] = 'application/json';

    if (requiresAuth) {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) requestHeaders.Authorization = `Bearer ${token}`;
    }

    const requestInit: RequestInit = { method, headers: requestHeaders };
    if (body) requestInit.body = isFormData ? body : JSON.stringify(body);

    return safeCall(async () => {
        const response = await transport.execute(constructRoute(route), requestInit);

        if (response.status === 401 && requiresAuth) {
            if (retryOnUnauthorized) {
                try {
                    const accessToken = await refreshAccessToken();
                    return request<T>(route, {
                        ...options,
                        headers: { ...headers, Authorization: `Bearer ${accessToken}` },
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

        return responseToResult<T>(response);
    });
}

export function get<T = unknown>(route: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(route, { ...options, method: 'GET' });
}

export function post<T = unknown>(route: string, body: object | FormData, options: RequestOptions = {}): Promise<T> {
    return request<T>(route, { ...options, method: 'POST', body });
}

export function put<T = unknown>(route: string, body: object | FormData, options: RequestOptions = {}): Promise<T> {
    return request<T>(route, { ...options, method: 'PUT', body });
}

export function del<T = unknown>(route: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(route, { ...options, method: 'DELETE' });
}

export async function saveTokens(accessToken: string, refreshToken?: string | null): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
}

export async function saveCurrentUser(user: unknown): Promise<void> {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export async function getCurrentUser<T = unknown>(): Promise<T | null> {
    const stored = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) as T : null;
}

export function clearCurrentUser(): Promise<void> {
    return AsyncStorage.removeItem(CURRENT_USER_KEY);
}

export async function clearSession(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, CURRENT_USER_KEY]);
}

const HttpClientExt = {
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

export default HttpClientExt;
