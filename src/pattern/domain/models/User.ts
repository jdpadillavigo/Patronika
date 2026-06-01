export interface User {
    id: string | null;
    username: string;
    email: string;
    isAdmin: boolean;
    loggedIn: boolean;
    status: number;
    registeredDate: string | null;
    activateNotification: boolean;
}

export interface ValidationResult {
    isValid: boolean;
    message: string;
}

/** Crea un modelo User a partir de datos del API. */
export function createUser(apiData: Partial<User>): User {
    return {
        id: apiData.id || null,
        username: apiData.username || '',
        email: apiData.email || '',
        isAdmin: apiData.isAdmin || false,
        loggedIn: apiData.loggedIn || false,
        status: apiData.status || 0,
        registeredDate: apiData.registeredDate || null,
        activateNotification: apiData.activateNotification || false,
    };
}

export function validateUsername(username: string): ValidationResult {
    if (!username.trim()) {
        return { isValid: false, message: 'Por favor ingresa tu nombre de usuario' };
    }
    if (username.trim().length < 3) {
        return { isValid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
    }
    return { isValid: true, message: '' };
}

export function validateEmail(email: string): ValidationResult {
    if (!email.trim()) {
        return { isValid: false, message: 'Por favor ingresa tu correo electrónico' };
    }
    if (!email.includes('@')) {
        return { isValid: false, message: 'Por favor ingresa un correo válido' };
    }
    return { isValid: true, message: '' };
}

export function validatePassword(password: string): ValidationResult {
    if (!password.trim()) {
        return { isValid: false, message: 'Por favor ingresa tu contraseña' };
    }
    if (password.length < 6) {
        return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    return { isValid: true, message: '' };
}
