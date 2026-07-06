import HttpClient from '../../../../core/data/network/HttpClientExt';
import type { User } from '../../../../core/domain/models/User';
import { createUser } from '../../../../core/domain/models/User';
import UserRemoteDataSource, { type UserRequest } from '../networking/UserRemoteDataSource';
import LoginRemoteDataSource from '../../../auth/login/data/network/LoginRemoteDataSource';
import RegisterRemoteDataSource from '../../../auth/register/data/network/RegisterRemoteDataSource';

// Construye el body JSON que acepta PUT /api/users/{id}.
// La contraseña es obligatoria en el backend; se incluye si se recibe.
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

// Obtiene el usuario actual combinando los datos remotos con el avatar guardado localmente.
// IMPORTANTE: prioriza el profileImageUrl del backend para que la foto persista
// entre cierres de sesión. Si el backend ya tiene la foto, no necesitamos el cache local.
async function getCurrent(): Promise<User | null> {
    const localUser = await HttpClient.getCurrentUser<User>();
    if (!localUser?.id) return localUser;

    const remoteUser = createUser(await UserRemoteDataSource.loadById(localUser.id));
    // Si el backend tiene profileImageUrl (subido previamente), lo usa como avatar.
    // De lo contrario cae en el avatar guardado localmente en sesión anterior.
    const avatar = remoteUser.profileImageUrl || localUser.avatar || null;
    await HttpClient.saveCurrentUser({ ...remoteUser, avatar });
    return { ...remoteUser, avatar };
}

// Actualiza el perfil del usuario en dos pasos:
// 1) Actualiza nombre/contraseña con PUT /api/users/{id}
// 2) Si el avatar es un archivo local (file://...), lo sube con PUT /api/users/{id}/profile-image
// Luego recarga el usuario del backend para obtener el profileImageUrl actualizado.
async function updateProfile(username: string, password: string, avatar?: string | null): Promise<User> {
    const currentUser = await HttpClient.getCurrentUser<User>();
    if (!currentUser?.id) {
        throw new Error('Inicia sesion nuevamente para actualizar tu perfil');
    }

    // Paso 1: actualiza datos básicos del perfil
    await UserRemoteDataSource.update(currentUser.id, toUserRequest({ ...currentUser, username }, password));

    // Paso 2: sube la imagen al backend solo si es un archivo local nuevo (file://)
    // Si ya es una URL remota (https://...) significa que ya está en el servidor, no se re-sube
    if (avatar && avatar.startsWith('file://')) {
        await UserRemoteDataSource.uploadAvatar(currentUser.id, avatar);
    }

    // Paso 3: recarga el usuario del backend para obtener el profileImageUrl definitivo
    const updated = createUser(await UserRemoteDataSource.loadById(currentUser.id));
    const finalAvatar = updated.profileImageUrl || avatar || currentUser.avatar || null;
    const withAvatar = { ...updated, avatar: finalAvatar };
    await HttpClient.saveCurrentUser(withAvatar);
    return withAvatar;
}

// Cambia la contraseña: primero valida la contraseña actual haciendo login,
// luego actualiza con la nueva contraseña.
async function changePassword(currentPassword: string, newPassword: string): Promise<{ user: User; message: string }> {
    const currentUser = await HttpClient.getCurrentUser<User>();
    if (!currentUser?.id) {
        throw new Error('Inicia sesión nuevamente para cambiar tu contraseña');
    }

    const tokens = await LoginRemoteDataSource.login(currentUser.username, currentPassword);
    await HttpClient.saveTokens(tokens.accessToken, tokens.refreshToken);
    const message = await UserRemoteDataSource.changePassword(currentUser.email, newPassword);

    const updated = createUser(await UserRemoteDataSource.loadById(currentUser.id));
    await HttpClient.saveCurrentUser({ ...updated, avatar: currentUser.avatar || null });
    return { user: { ...updated, avatar: currentUser.avatar || null }, message };
}

async function getAllUsers(): Promise<User[]> {
    const users = await UserRemoteDataSource.loadAll();
    return users.map(user => createUser(user));
}

async function getUserById(id: string): Promise<User> {
    return createUser(await UserRemoteDataSource.loadById(id));
}

async function updateUser(user: User, profileImageUri?: string | null): Promise<{ user: User; message: string }> {
    if (!user.id) {
        throw new Error('Usuario no encontrado');
    }

    const currentUser = await HttpClient.getCurrentUser<User>();
    let message = await UserRemoteDataSource.update(user.id, toUserRequest(user));
    if (profileImageUri && profileImageUri.startsWith('file://')) {
        message = await UserRemoteDataSource.uploadAvatar(user.id, profileImageUri);
    }
    const updated = createUser(await UserRemoteDataSource.loadById(user.id));
    const finalAvatar = updated.profileImageUrl || profileImageUri || user.avatar || null;
    const withAvatar = { ...updated, avatar: finalAvatar };
    if (currentUser?.id === user.id) {
        await HttpClient.saveCurrentUser(withAvatar);
    }
    return { user: withAvatar, message };
}

async function updateProfileImage(user: User, profileImageUri: string): Promise<{ user: User; message: string }> {
    if (!user.id) {
        throw new Error('Usuario no encontrado');
    }

    const currentUser = await HttpClient.getCurrentUser<User>();
    const message = await UserRemoteDataSource.uploadAvatar(user.id, profileImageUri);
    const updated = createUser(await UserRemoteDataSource.loadById(user.id));
    const withAvatar = { ...updated, avatar: updated.profileImageUrl || profileImageUri || user.avatar || null };
    if (currentUser?.id === user.id) {
        await HttpClient.saveCurrentUser(withAvatar);
    }
    return { user: withAvatar, message };
}

async function createUserFromAdmin(
    username: string,
    email: string,
    password: string,
    profileImageUri?: string | null,
): Promise<User> {
    return createUser(await RegisterRemoteDataSource.register(username, email, password, profileImageUri));
}

async function deleteUser(user: User): Promise<void> {
    if (!user.id) {
        throw new Error('Usuario no encontrado');
    }

    await UserRemoteDataSource.remove(user.id, user.username);
}

async function suspendUser(user: User, days: number, reason: string): Promise<{ user: User; message: string }> {
    if (!user.id) {
        throw new Error('Usuario no encontrado');
    }

    const currentUser = await HttpClient.getCurrentUser<User>();
    const adminId = currentUser?.id;
    if (!adminId) {
        throw new Error('No se encontró el administrador');
    }

    await UserRemoteDataSource.suspend(user.id, adminId, days, reason);
    const updated = createUser(await UserRemoteDataSource.loadById(user.id));
    return { user: updated, message: 'Usuario suspendido correctamente' };
}

const UserRepository = {
    getCurrent,
    updateProfile,
    changePassword,
    getAllUsers,
    getUserById,
    createUserFromAdmin,
    updateUser,
    updateProfileImage,
    deleteUser,
    suspendUser,
};

export default UserRepository;
