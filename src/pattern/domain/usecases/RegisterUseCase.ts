import AuthRepository, { type AuthResult } from '../../data/repositories/AuthRepository';
import { validateEmail, validatePassword, validateUsername } from '../models/User';

async function requestCode(username: string, email: string, password: string, confirmPassword: string): Promise<AuthResult> {
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) return { success: false, error: usernameValidation.message };

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) return { success: false, error: emailValidation.message };

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) return { success: false, error: passwordValidation.message };

    if (password !== confirmPassword) {
        return { success: false, error: 'Las contraseñas no coinciden' };
    }

    try {
        return await AuthRepository.requestRegisterCode(email.trim());
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al solicitar el código';
        return { success: false, error: message };
    }
}

async function verifyCode(email: string, code: string): Promise<AuthResult> {
    try {
        return await AuthRepository.verifyRegisterCode(email.trim(), code);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al verificar el código';
        return { success: false, error: message };
    }
}

async function complete(username: string, email: string, password: string, profileImageUri?: string | null): Promise<AuthResult> {
    try {
        return await AuthRepository.register(username.trim(), email.trim(), password, profileImageUri);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al crear la cuenta';
        return { success: false, error: message };
    }
}

const RegisterUseCase = {
    requestCode,
    verifyCode,
    complete,
};

export default RegisterUseCase;
