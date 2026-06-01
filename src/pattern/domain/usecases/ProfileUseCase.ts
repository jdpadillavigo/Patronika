import UserRepository from '../../data/repositories/UserRepository';
import { validatePassword, validateUsername } from '../models/User';

async function getCurrent() {
    return UserRepository.getCurrent();
}

async function updateProfile(username: string, avatar?: string | null) {
    const validation = validateUsername(username);
    if (!validation.isValid) {
        return { success: false, error: validation.message };
    }

    try {
        const user = await UserRepository.updateProfile(username.trim(), avatar);
        return { success: true, data: user };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al actualizar el perfil';
        return { success: false, error: message };
    }
}

async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    const currentValidation = validatePassword(currentPassword);
    if (!currentValidation.isValid) return { success: false, error: currentValidation.message };

    const newValidation = validatePassword(newPassword);
    if (!newValidation.isValid) return { success: false, error: newValidation.message };

    if (newPassword !== confirmPassword) {
        return { success: false, error: 'Las contrasenas nuevas no coinciden' };
    }

    try {
        const user = await UserRepository.changePassword(currentPassword, newPassword);
        return { success: true, data: user };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al cambiar la contrasena';
        return { success: false, error: message };
    }
}

const ProfileUseCase = {
    getCurrent,
    updateProfile,
    changePassword,
};

export default ProfileUseCase;
