import AuthRepository from '../../data/repositories/AuthRepository';
import { validateUsername, validateEmail, validatePassword } from '../models/User';

/**
 * @param { string } username
 * @param { string } email
 * @param { string } password
 * @param { string } confirmPassword
 * @returns { Promise<{ success: boolean, data?: string, error?: string }>}
 */
async function execute(username, email, password, confirmPassword) {
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
            return { success: false, error: response.data || 'Error al crear la cuenta' };
        }
    } catch (error) {
        return { success: false, error: error.message || 'Error al crear la cuenta' };
    }
}

const RegisterUseCase = { execute };

export default RegisterUseCase;
