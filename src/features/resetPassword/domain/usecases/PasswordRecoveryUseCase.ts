import VerificationRepository from '../../../auth/verification/data/repositories/VerificationRepository';
import { validateEmail, validatePassword } from '../../../../core/domain/models/User';

async function requestCode(email: string) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) return { success: false, error: emailValidation.message };

    try {
        return await VerificationRepository.requestPasswordRecoveryCode(email.trim());
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al enviar el código';
        return { success: false, error: message };
    }
}

async function verifyCode(email: string, code: string) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) return { success: false, error: emailValidation.message };

    try {
        return await VerificationRepository.verifyCode(email.trim(), code);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al verificar el código';
        return { success: false, error: message };
    }
}

async function resetPassword(email: string, password: string, confirmPassword: string) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) return { success: false, error: emailValidation.message };

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) return { success: false, error: passwordValidation.message };
    if (password !== confirmPassword) return { success: false, error: 'Las contraseñas no coinciden' };

    try {
        return await VerificationRepository.changePassword(email.trim(), password);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al restablecer la contraseña';
        return { success: false, error: message };
    }
}

const PasswordRecoveryUseCase = {
    requestCode,
    verifyCode,
    resetPassword,
};

export default PasswordRecoveryUseCase;
