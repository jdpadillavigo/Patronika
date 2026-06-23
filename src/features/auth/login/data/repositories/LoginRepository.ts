import HttpClient from '../../../../../core/data/network/HttpClientExt';
import { createUser, type User } from '../../../../../core/domain/models/User';
import UserRemoteDataSource from '../../../../user/data/networking/UserRemoteDataSource';
import LoginRemoteDataSource from '../network/LoginRemoteDataSource';

export interface AuthResult {
    success: boolean;
    data?: unknown;
    error?: string;
    sessionExpired?: boolean;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        return JSON.parse(globalThis.atob(normalized)) as Record<string, unknown>;
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
        const users = await UserRemoteDataSource.loadAll();
        const user = users.find(item => item.username.toLowerCase() === username.toLowerCase());
        return user ? createUser(user) : null;
    } catch {
        return createUserFromToken(accessToken, username);
    }
}

async function login(username: string, password: string): Promise<AuthResult> {
    const tokens = await LoginRemoteDataSource.login(username, password);
    await HttpClient.saveTokens(tokens.accessToken, tokens.refreshToken);
    const user = await resolveCurrentUser(username, tokens.accessToken);
    if (user) await HttpClient.saveCurrentUser(user);
    return { success: true, data: user };
}

function getSession(): Promise<User | null> {
    return HttpClient.getCurrentUser<User>();
}

async function logout(userId?: string | null): Promise<void> {
    const refreshToken = await HttpClient.getRefreshToken();
    try {
        if (userId && refreshToken) await LoginRemoteDataSource.logout(userId, refreshToken);
    } catch (error: unknown) {
        console.warn('Error en logout del servidor:', error instanceof Error ? error.message : 'Error desconocido');
    }
    await HttpClient.clearSession();
}

const LoginRepository = { login, getSession, logout };

export default LoginRepository;
