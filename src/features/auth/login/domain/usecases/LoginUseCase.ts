import LoginRepository, { type AuthResult } from '../../data/repositories/LoginRepository';
import { validatePassword, validateUsername } from '../../../../../core/domain/models/User';

async function execute(username: string, password: string): Promise<AuthResult> {
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) return { success: false, error: usernameValidation.message };

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) return { success: false, error: passwordValidation.message };

    try {
        return await LoginRepository.login(username.trim(), password);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
        return { success: false, error: message };
    }
}

const LoginUseCase = { execute };

export default LoginUseCase;
