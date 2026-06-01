import AuthRepository, { type AuthResult } from '../../data/repositories/AuthRepository';
import { validatePassword, validateUsername } from '../models/User';

async function execute(username: string, password: string): Promise<AuthResult> {
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) return { success: false, error: usernameValidation.message };

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) return { success: false, error: passwordValidation.message };

    try {
        return await AuthRepository.login(username.trim(), password);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al iniciar sesion';
        return { success: false, error: message };
    }
}

const LoginUseCase = { execute };

export default LoginUseCase;
