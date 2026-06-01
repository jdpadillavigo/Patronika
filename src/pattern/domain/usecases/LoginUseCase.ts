import AuthRepository, { type AuthResult } from '../../data/repositories/AuthRepository';
import { validateUsername, validatePassword } from '../models/User';

async function execute(username: string, password: string): Promise<AuthResult> {
    // Validar campos
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        return { success: false, error: usernameValidation.message };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.message };
    }

    try {
        const response = await AuthRepository.login(username, password);

        if (response.success) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: response.error || 'Error al iniciar sesión' };
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
        return { success: false, error: message };
    }
}

const LoginUseCase = { execute };

export default LoginUseCase;
