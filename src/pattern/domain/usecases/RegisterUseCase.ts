import AuthRepository, { type AuthResult } from '../../data/repositories/AuthRepository';
import { validateUsername, validateEmail, validatePassword } from '../models/User';

async function execute(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
): Promise<AuthResult> {
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
        const response = await AuthRepository.register(username, email, password);

        if (response.success) {
            return { success: true, data: response.data || 'Cuenta creada exitosamente' };
        } else {
            return { success: false, error: response.error || 'Error al crear la cuenta' };
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al crear la cuenta';
        return { success: false, error: message };
    }
}

const RegisterUseCase = { execute };

export default RegisterUseCase;
