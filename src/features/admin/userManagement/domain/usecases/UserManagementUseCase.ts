import UserRepository from '../../../../user/data/repositories/UserRepository';
import { validateEmail, validateUsername, type User } from '../../../../../core/domain/models/User';
import { isSessionExpiredError } from '../../../../../core/data/network/HttpClientExt';
 
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

async function updateUser(user: User) {
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
        });
        return { success: true, data: updated };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }
        const message = error instanceof Error ? error.message : 'Error al actualizar el usuario';
        return { success: false, error: message };
    }
}

async function updateUserStatus(user: User, status: number) {
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
    updateUser,
    updateUserStatus,
    deleteUser,
};
 
export default UserUseCase;
