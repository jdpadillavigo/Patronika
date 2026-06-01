import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL: string = process.env.EXPO_PUBLIC_API_URL || '';

// Claves de AsyncStorage
const TOKEN_KEY = '@patronika_auth_token';
const REFRESH_TOKEN_KEY = '@patronika_refresh_token';

/** Opciones para las peticiones HTTP. */
interface RequestOptions {
    method?: string;
    body?: Record<string, unknown> | null;
    requiresAuth?: boolean;
    headers?: Record<string, string>;
}

/**
 * Realiza una petición HTTP al backend.
 */
async function request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
        method = 'GET',
        body = null,
        requiresAuth = true,
        headers = {},
    } = options;

    // Construir headers
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    // Agregar token JWT si es requerido
    if (requiresAuth) {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    // Configurar la petición
    const config: RequestInit = {
        method,
        headers: requestHeaders,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data: T = await response.json();
        console.log(data);
        if (!response.ok) {
            // El backend envuelve errores en { success: false, data: "mensaje" }
            const errorData = data as Record<string, unknown>;
            const errorMessage = (errorData?.data as string) || (errorData?.message as string) || 'Error en la solicitud';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error: unknown) {
        // Si es un error de red (no de la API)
        if (error instanceof Error && error.message === 'Network request failed') {
            throw new Error('Sin conexión a internet. Verifica tu conexión e intenta de nuevo.');
        }
        throw error;
    }
}

// --- Métodos de conveniencia ---

function get<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
}

function post<T = unknown>(endpoint: string, body: Record<string, unknown>, options: RequestOptions = {}): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body });
}

function put<T = unknown>(endpoint: string, body: Record<string, unknown>, options: RequestOptions = {}): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
}

function del<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
}

// --- Gestión de tokens ---

async function saveTokens(accessToken: string, refreshToken?: string | null): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

async function getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
}

async function getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

async function clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
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
    BASE_URL,
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
};

export default ApiClient;
