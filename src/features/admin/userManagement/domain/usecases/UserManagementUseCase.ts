import UserRepository from '../../../../user/data/repositories/UserRepository';
import { validateEmail, validatePassword, validateUsername, type User } from '../../../../../core/domain/models/User';
import { isSessionExpiredError } from '../../../../../core/data/network/HttpClientExt';

function getFriendlyUserError(error: unknown, fallback: string): string {
    const message = error instanceof Error ? error.message : fallback;
    const normalized = message.toLowerCase();

    if (
        normalized.includes('username')
        || normalized.includes('nombre de usuario')
        || (normalized.includes('usuario') && (normalized.includes('existe') || normalized.includes('registrado') || normalized.includes('duplicate')))
    ) {
        return 'Ya existe un usuario con ese nombre de usuario.';
    }

    if (
        normalized.includes('email')
        || normalized.includes('correo')
        || normalized.includes('e-mail')
    ) {
        return 'Ya existe un usuario con ese correo electrónico.';
    }

    return message;
}
 
// Obtiene el listado completo de usuarios registrados (requiere rol admin en backend)
async function getAllUsers() {
    try {
        const users = await UserRepository.getAllUsers();
        return { success: true, data: users };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }
        const message = error instanceof Error ? error.message : 'Error al cargar los usuarios';
        return { success: false, error: message };
    }
}

async function getUserById(id: string) {
    try {
        const user = await UserRepository.getUserById(id);
        return { success: true, data: user };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }
        const message = error instanceof Error ? error.message : 'Error al cargar el usuario';
        return { success: false, error: message };
    }
}

async function updateUser(user: User, profileImageUri?: string | null) {
    const usernameValidation = validateUsername(user.username);
    if (!usernameValidation.isValid) {
        return { success: false, error: usernameValidation.message };
    }

    const emailValidation = validateEmail(user.email);
    if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.message };
    }

    try {
        const updated = await UserRepository.updateUser({
            ...user,
            username: user.username.trim(),
            email: user.email.trim(),
        }, profileImageUri);
        return { success: true, data: updated.user, message: updated.message };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }
        const message = getFriendlyUserError(error, 'Error al actualizar el usuario');
        return { success: false, error: message };
    }
}

async function changeOwnPassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    const currentValidation = validatePassword(currentPassword);
    if (!currentValidation.isValid) return { success: false, error: currentValidation.message };

    const newValidation = validatePassword(newPassword);
    if (!newValidation.isValid) return { success: false, error: newValidation.message };

    if (newPassword !== confirmPassword) {
        return { success: false, error: 'Las contraseñas nuevas no coinciden' };
    }

    try {
        const updated = await UserRepository.changePassword(currentPassword, newPassword);
        return { success: true, data: updated.user, message: updated.message };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }
        const rawMessage = error instanceof Error ? error.message : '';
        const normalized = rawMessage.toLowerCase();
        const message = normalized.includes('autenticar')
            || normalized.includes('credencial')
            || normalized.includes('contraseña')
            || normalized.includes('password')
            ? 'La contraseña actual no es correcta.'
            : rawMessage || 'No se pudo cambiar la contraseña';
        return { success: false, error: message };
    }
}

async function updateProfileImage(user: User, profileImageUri: string) {
    try {
        const updated = await UserRepository.updateProfileImage(user, profileImageUri);
        return { success: true, data: updated.user, message: updated.message };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }
        const message = error instanceof Error ? error.message : 'No se pudo actualizar la imagen de perfil';
        return { success: false, error: message };
    }
}

async function createUser(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    profileImageUri?: string | null,
) {
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        return { success: false, error: usernameValidation.message };
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.message };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.message };
    }

    if (password !== confirmPassword) {
        return { success: false, error: 'Las contraseñas no coinciden' };
    }

    try {
        const created = await UserRepository.createUserFromAdmin(
            username.trim(),
            email.trim(),
            password,
            profileImageUri,
        );
        return { success: true, data: created };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }
        const message = getFriendlyUserError(error, 'Error al registrar el usuario');
        return { success: false, error: message };
    }
}

async function updateUserStatus(user: User, status: number, suspensionDraft?: { days: number; reason: string } | null) {
    void suspensionDraft;
    return updateUser({ ...user, status });
}

async function deleteUser(user: User) {
    try {
        await UserRepository.deleteUser(user);
        return { success: true };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }
        const message = error instanceof Error ? error.message : 'Error al eliminar el usuario';
        return { success: false, error: message };
    }
}
 
const UserUseCase = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    changeOwnPassword,
    updateProfileImage,
    updateUserStatus,
    deleteUser,
};
 
export default UserUseCase;
