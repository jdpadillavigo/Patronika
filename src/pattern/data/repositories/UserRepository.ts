import ApiClient from '../../../core/data/networking/ApiClient';
import type { User } from '../../domain/models/User';
import { createUser } from '../../domain/models/User';
import UserRemoteDataSource, { type UserRequest } from '../networking/UserRemoteDataSource';
import AuthRemoteDataSource from '../networking/AuthRemoteDataSource';

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
    const localUser = await ApiClient.getCurrentUser<User>();
    if (!localUser?.id) return localUser;

    const remoteUser = createUser(await UserRemoteDataSource.loadById(localUser.id));
    // Si el backend tiene profileImageUrl (subido previamente), lo usa como avatar.
    // De lo contrario cae en el avatar guardado localmente en sesión anterior.
    const avatar = remoteUser.profileImageUrl || localUser.avatar || null;
    await ApiClient.saveCurrentUser({ ...remoteUser, avatar });
    return { ...remoteUser, avatar };
}

// Actualiza el perfil del usuario en dos pasos:
// 1) Actualiza nombre/contraseña con PUT /api/users/{id}
// 2) Si el avatar es un archivo local (file://...), lo sube con PUT /api/users/{id}/profile-image
// Luego recarga el usuario del backend para obtener el profileImageUrl actualizado.
async function updateProfile(username: string, password: string, avatar?: string | null): Promise<User> {
    const currentUser = await ApiClient.getCurrentUser<User>();
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
    await ApiClient.saveCurrentUser(withAvatar);
    return withAvatar;
}

// Cambia la contraseña: primero valida la contraseña actual haciendo login,
// luego actualiza con la nueva contraseña.
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

async function getAllUsers(): Promise<User[]> {
    const users = await UserRemoteDataSource.loadAll();
    return users.map(user => createUser(user));
}

const UserRepository = {
    getCurrent,
    updateProfile,
    changePassword,
    getAllUsers,
};

export default UserRepository;
