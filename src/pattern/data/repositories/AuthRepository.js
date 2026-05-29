import ApiClient from '../../../core/data/networking/ApiClient';

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} - { success, data: { accessToken, refreshToken, ... } }
 */
async function login(username, password) {
    const response = await ApiClient.post(
        '/api/auth/login',
        { username, password },
        { requiresAuth: false }
    );

    // Si el login es exitoso, guardar los tokens
    if (response.success && response.data) {
        const accessToken = response.data.accessToken || response.data.token;
        const refreshToken = response.data.refreshToken;

        if (accessToken) {
            await ApiClient.saveTokens(accessToken, refreshToken);
        }
    }

    return response;
}

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}
 */
async function register(username, email, password) {
    const response = await ApiClient.post(
        '/api/auth/register',
        {
            username,
            email,
            password,
            isAdmin: false,
            status: 1,
            activateNotification: true,
        },
        { requiresAuth: false }
    );

    return response;
}

/**
 * @param {string} userId
 * @returns {Promise<object>}
 */
async function logout(userId) {
    const refreshToken = await ApiClient.getRefreshToken();

    try {
        await ApiClient.post(`/api/auth/logout/${userId}`, {
            refreshToken: refreshToken || '',
        });
    } catch (error) {
        // Incluso si falla el logout en el servidor, limpiamos tokens locales
        console.warn('Error en logout del servidor:', error.message);
    }

    // Siempre limpiar tokens locales
    await ApiClient.clearTokens();
}

const AuthRepository = {
    login,
    register,
    logout,
};

export default AuthRepository;
