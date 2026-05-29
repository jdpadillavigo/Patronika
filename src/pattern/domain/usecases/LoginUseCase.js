import AuthRepository from '../../data/repositories/AuthRepository';
import { validateUsername, validatePassword } from '../models/User';

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
async function execute(username, password) {
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
            return { success: false, error: response.data || 'Error al iniciar sesión' };
        }
    } catch (error) {
        return { success: false, error: error.message || 'Error al iniciar sesión' };
    }
}

const LoginUseCase = { execute };

export default LoginUseCase;
