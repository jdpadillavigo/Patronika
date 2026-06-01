import ApiClient from '../../../core/data/networking/ApiClient';
import AuthRemoteDataSource from '../networking/AuthRemoteDataSource';
import UserRemoteDataSource from '../networking/UserRemoteDataSource';
import { createUser, type User } from '../../domain/models/User';

export interface AuthResult {
    success: boolean;
    data?: unknown;
    error?: string;
}

async function findUserByUsername(username: string): Promise<User | null> {
    const users = await UserRemoteDataSource.loadAll();
    const user = users.find(item => item.username.toLowerCase() === username.toLowerCase());
    return user ? createUser(user) : null;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;

        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        const decoded = globalThis.atob(normalized);
        return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
        return null;
    }
}

function createUserFromToken(token: string, fallbackUsername: string): User | null {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    const id = payload.id || payload.userId || payload.sub;
    return createUser({
        id: typeof id === 'string' ? id : null,
        username: typeof payload.username === 'string' ? payload.username : fallbackUsername,
        email: typeof payload.email === 'string' ? payload.email : '',
        isAdmin: payload.isAdmin === true,
        loggedIn: true,
        status: 0,
        activateNotification: true,
    });
}

async function resolveCurrentUser(username: string, accessToken: string): Promise<User | null> {
    try {
        return await findUserByUsername(username);
    } catch {
        return createUserFromToken(accessToken, username);
    }
}

async function login(username: string, password: string): Promise<AuthResult> {
    const tokens = await AuthRemoteDataSource.login(username, password);
    await ApiClient.saveTokens(tokens.accessToken, tokens.refreshToken);

    const user = await resolveCurrentUser(username, tokens.accessToken);
    if (user) {
        await ApiClient.saveCurrentUser(user);
    }

    return { success: true, data: user };
}

async function requestRegisterCode(email: string): Promise<AuthResult> {
    const message = await AuthRemoteDataSource.requestRegisterCode(email);
    return { success: true, data: message };
}

async function verifyRegisterCode(email: string, code: string): Promise<AuthResult> {
    const verificationToken = await AuthRemoteDataSource.verifyRegisterCode(email, code);
    return { success: true, data: verificationToken };
}

async function register(verificationToken: string, username: string, email: string, password: string): Promise<AuthResult> {
    const tokens = await AuthRemoteDataSource.register(verificationToken, username, email, password);
    await ApiClient.saveTokens(tokens.accessToken, tokens.refreshToken);

    const user = await resolveCurrentUser(username, tokens.accessToken);
    if (user) {
        await ApiClient.saveCurrentUser(user);
    }

    return { success: true, data: user };
}

async function getSession(): Promise<User | null> {
    return ApiClient.getCurrentUser<User>();
}

async function logout(userId?: string | null): Promise<void> {
    const refreshToken = await ApiClient.getRefreshToken();

    try {
        if (userId && refreshToken) {
            await AuthRemoteDataSource.logout(userId, refreshToken);
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.warn('Error en logout del servidor:', message);
    }

    await ApiClient.clearSession();
}

const AuthRepository = {
    login,
    requestRegisterCode,
    verifyRegisterCode,
    register,
    getSession,
    logout,
};

export default AuthRepository;
