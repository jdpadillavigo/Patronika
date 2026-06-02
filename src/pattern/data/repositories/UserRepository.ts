import ApiClient from '../../../core/data/networking/ApiClient';
import type { User } from '../../domain/models/User';
import { createUser } from '../../domain/models/User';
import UserRemoteDataSource, { type UserRequest } from '../networking/UserRemoteDataSource';
import AuthRemoteDataSource from '../networking/AuthRemoteDataSource';

function toUserRequest(user: User, password?: string): UserRequest {
    const request: UserRequest = {
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        status: user.status,
        activateNotification: user.activateNotification,
        suspensionEndDate: user.suspensionEndDate || null,
    };

    if (password) {
        request.password = password;
    }

    return request;
}

async function getCurrent(): Promise<User | null> {
    const localUser = await ApiClient.getCurrentUser<User>();
    if (!localUser?.id) return localUser;

    const remoteUser = createUser(await UserRemoteDataSource.loadById(localUser.id));
    await ApiClient.saveCurrentUser({ ...remoteUser, avatar: localUser.avatar || null });
    return { ...remoteUser, avatar: localUser.avatar || null };
}

async function updateProfile(username: string, avatar?: string | null): Promise<User> {
    const currentUser = await ApiClient.getCurrentUser<User>();
    if (!currentUser?.id) {
        throw new Error('Inicia sesion nuevamente para actualizar tu perfil');
    }

    await UserRemoteDataSource.update(currentUser.id, toUserRequest({ ...currentUser, username }));
    const updated = createUser(await UserRemoteDataSource.loadById(currentUser.id));
    const withLocalAvatar = { ...updated, avatar: avatar ?? currentUser.avatar ?? null };
    await ApiClient.saveCurrentUser(withLocalAvatar);
    return withLocalAvatar;
}

async function changePassword(currentPassword: string, newPassword: string): Promise<User> {
    const currentUser = await ApiClient.getCurrentUser<User>();
    if (!currentUser?.id) {
        throw new Error('Inicia sesión nuevamente para cambiar tu contraseña');
    }

    const tokens = await AuthRemoteDataSource.login(currentUser.username, currentPassword);
    await ApiClient.saveTokens(tokens.accessToken, tokens.refreshToken);
    await UserRemoteDataSource.update(currentUser.id, toUserRequest(currentUser, newPassword));

    const updated = createUser(await UserRemoteDataSource.loadById(currentUser.id));
    await ApiClient.saveCurrentUser({ ...updated, avatar: currentUser.avatar || null });
    return { ...updated, avatar: currentUser.avatar || null };
}

const UserRepository = {
    getCurrent,
    updateProfile,
    changePassword,
};

export default UserRepository;
