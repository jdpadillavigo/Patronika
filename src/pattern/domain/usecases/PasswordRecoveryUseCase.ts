import AuthRepository from '../../data/repositories/AuthRepository';
import { validateEmail, validatePassword } from '../models/User';

async function requestCode(email: string) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) return { success: false, error: emailValidation.message };

    try {
        return await AuthRepository.requestRegisterCode(email.trim());
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al enviar el codigo';
        return { success: false, error: message };
    }
}

async function verifyCode(email: string, code: string) {
    try {
        return await AuthRepository.verifyRegisterCode(email.trim(), code);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al verificar el codigo';
        return { success: false, error: message };
    }
}

async function resetPassword(password: string, confirmPassword: string) {
    const validation = validatePassword(password);
    if (!validation.isValid) return { success: false, error: validation.message };
    if (password !== confirmPassword) return { success: false, error: 'Las contrasenas no coinciden' };

    return {
        success: false,
        error: 'El backend aun no expone un endpoint para restablecer contrasena.',
    };
}

const PasswordRecoveryUseCase = {
    requestCode,
    verifyCode,
    resetPassword,
};

export default PasswordRecoveryUseCase;
