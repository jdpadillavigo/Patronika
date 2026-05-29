import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Claves de AsyncStorage
const TOKEN_KEY = '@patronika_auth_token';
const REFRESH_TOKEN_KEY = '@patronika_refresh_token';

/**
 * Realiza una petición HTTP al backend.
 *
 * @param {string} endpoint - Ruta del endpoint (ej: '/api/auth/login')
 * @param {object} options
 * @param {string} options.method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {object} options.body - Cuerpo de la petición (se convierte a JSON)
 * @param {boolean} options.requiresAuth - Si necesita enviar el token JWT (default: true)
 * @param {object} options.headers - Headers adicionales
 * @returns {Promise<object>} - Respuesta parseada como JSON
 */
async function request(endpoint, options = {}) {
    const {
        method = 'GET',
        body = null,
        requiresAuth = true,
        headers = {},
    } = options;

    // Construir headers
    const requestHeaders = {
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
    const config = {
        method,
        headers: requestHeaders,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            // El backend envuelve errores en { success: false, data: "mensaje" }
            const errorMessage = data?.data || data?.message || 'Error en la solicitud';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        // Si es un error de red (no de la API)
        if (error.message === 'Network request failed') {
            throw new Error('Sin conexión a internet. Verifica tu conexión e intenta de nuevo.');
        }
        throw error;
    }
}

// --- Métodos de conveniencia ---

function get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
}

function post(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'POST', body });
}

function put(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'PUT', body });
}

function del(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
}

// --- Gestión de tokens ---

async function saveTokens(accessToken, refreshToken) {
    await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

async function getAccessToken() {
    return await AsyncStorage.getItem(TOKEN_KEY);
}

async function getRefreshToken() {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

async function clearTokens() {
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
