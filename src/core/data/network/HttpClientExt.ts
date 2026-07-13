import AsyncStorage from '@react-native-async-storage/async-storage';

import ReadCache, { type ReadOptions } from '../cache/ReadCache';
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

class HttpNetworkError extends Error {
    constructor() {
        super('Sin conexión a internet. Verifica tu conexión e intenta de nuevo.');
        this.name = 'HttpNetworkError';
    }
}

export function isTemporaryHttpError(error: unknown): boolean {
    return error instanceof HttpNetworkError || error instanceof HttpTimeoutError
        || (error instanceof HttpResponseError && (error.status === 429 || error.status >= 500));
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
let sessionGeneration = 0;
let scopedCache: { scope: string; cache: ReadCache } | null = null;

async function getReadCache(generation: number): Promise<ReadCache | null> {
    const session = await AsyncStorage.multiGet([CURRENT_USER_KEY, TOKEN_KEY]);
    if (generation !== sessionGeneration) throw new SessionExpiredError();
    const storedUser = session[0]?.[1];
    const token = session[1]?.[1];
    if (!storedUser || !token) return null;

    const user = JSON.parse(storedUser) as { id?: string | null } | null;
    if (!user?.id) return null;
    const scope = JSON.stringify([BASE_URL, user.id]);
    if (scope !== scopedCache?.scope) {
        scopedCache = { scope, cache: new ReadCache(AsyncStorage, scope, isTemporaryHttpError) };
    }
    return scopedCache.cache;
}

export async function cachedRead<T>(
    key: string,
    load: () => Promise<T>,
    options: ReadOptions,
): Promise<T> {
    const generation = sessionGeneration;
    try {
        const cache = await getReadCache(generation).catch(() => null);
        if (generation !== sessionGeneration) throw new SessionExpiredError();
        return cache ? await cache.read(key, load, options) : await load();
    } finally {
        if (generation !== sessionGeneration) throw new SessionExpiredError();
    }
}

export async function cacheAfterWrite<T>(
    write: () => Promise<T>,
    update: (cache: ReadCache, result: T) => Promise<void>,
): Promise<T> {
    const generation = sessionGeneration;
    const result = await write();
    if (generation !== sessionGeneration) return result;
    const cache = await getReadCache(generation).catch(() => null);
    if (cache) await update(cache, result);
    return result;
}

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
            throw new HttpNetworkError();
        }

        throw error instanceof Error ? error : new Error('Ocurrió un error inesperado.');
    }
}

async function refreshAccessToken(): Promise<string> {
    if (refreshPromise) return refreshPromise;

    const generation = sessionGeneration;
    const pending = (async () => {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (generation !== sessionGeneration) throw new SessionExpiredError();
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

        if (generation !== sessionGeneration) throw new SessionExpiredError();
        await saveTokens(accessToken, nextRefreshToken);
        return accessToken;
    })().finally(() => {
        if (refreshPromise === pending) refreshPromise = null;
    });

    refreshPromise = pending;
    return pending;
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

    const generation = sessionGeneration;
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const requestHeaders: Record<string, string> = { ...headers };

    if (!isFormData) requestHeaders['Content-Type'] = 'application/json';

    if (requiresAuth) {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (generation !== sessionGeneration) throw new SessionExpiredError();
        if (token) requestHeaders.Authorization = `Bearer ${token}`;
    }

    const requestInit: RequestInit = { method, headers: requestHeaders };
    if (body) requestInit.body = isFormData ? body : JSON.stringify(body);

    return safeCall(async () => {
        const response = await transport.execute(constructRoute(route), requestInit);

        if (requiresAuth && generation !== sessionGeneration) throw new SessionExpiredError();

        if (response.status === 401 && requiresAuth) {
            if (retryOnUnauthorized) {
                try {
                    const latestToken = await AsyncStorage.getItem(TOKEN_KEY);
                    if (generation !== sessionGeneration) throw new SessionExpiredError();
                    const accessToken = latestToken && `Bearer ${latestToken}` !== requestHeaders.Authorization
                        ? latestToken
                        : await refreshAccessToken();
                    if (generation !== sessionGeneration) throw new SessionExpiredError();
                    return request<T>(route, {
                        ...options,
                        headers: { ...headers, Authorization: `Bearer ${accessToken}` },
                        retryOnUnauthorized: false,
                    });
                } catch (error: unknown) {
                    if (generation !== sessionGeneration) throw new SessionExpiredError();
                    if (isTemporaryHttpError(error)) throw error;
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
    const tokens: [string, string][] = [[TOKEN_KEY, accessToken]];
    if (refreshToken) tokens.push([REFRESH_TOKEN_KEY, refreshToken]);
    await AsyncStorage.multiSet(tokens);
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
    sessionGeneration += 1;
    refreshPromise = null;
    const cache = scopedCache?.cache ?? new ReadCache(AsyncStorage, '', isTemporaryHttpError);
    scopedCache = null;
    await Promise.all([
        AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, CURRENT_USER_KEY]),
        cache.clear(),
    ]);
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
