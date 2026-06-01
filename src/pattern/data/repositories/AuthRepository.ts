import ApiClient from '../../../core/data/networking/ApiClient';
import AuthRemoteDataSource from '../networking/AuthRemoteDataSource';

export interface AuthResult {
    success: boolean;
    data?: unknown;
    error?: string;
}

async function login(username: string, password: string): Promise<AuthResult> {
    const response = await AuthRemoteDataSource.login(username, password);

    // Si el login es exitoso, guardar los tokens localmente
    if (response.success && response.accessToken) {
        await ApiClient.saveTokens(response.accessToken, response.refreshToken);
    }

    if (response.success) {
        return { success: true };
    }

    return { success: false, error: response.error || undefined };
}

async function register(username: string, email: string, password: string): Promise<AuthResult> {
    const response = await AuthRemoteDataSource.register(username, email, password);

    if (response.success) {
        return { success: true, data: response.message };
    }

    return { success: false, error: response.error || undefined };
}

async function logout(userId: string): Promise<void> {
    const refreshToken = await ApiClient.getRefreshToken();

    try {
        await AuthRemoteDataSource.logout(userId, refreshToken);
    } catch (error: unknown) {
        // Incluso si falla el logout en el servidor, limpiamos tokens locales
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.warn('Error en logout del servidor:', message);
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
