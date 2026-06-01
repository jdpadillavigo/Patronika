export interface User {
    id: string | null;
    username: string;
    email: string;
    isAdmin: boolean;
    loggedIn: boolean;
    status: number;
    registeredDate: string | null;
    activateNotification: boolean;
    suspensionEndDate?: string | null;
    avatar?: string | null;
}

export interface ValidationResult {
    isValid: boolean;
    message: string;
}

export function createUser(apiData: Partial<User>): User {
    return {
        id: apiData.id || null,
        username: apiData.username || '',
        email: apiData.email || '',
        isAdmin: apiData.isAdmin || false,
        loggedIn: apiData.loggedIn || false,
        status: apiData.status || 0,
        registeredDate: apiData.registeredDate || null,
        activateNotification: apiData.activateNotification ?? true,
        suspensionEndDate: apiData.suspensionEndDate || null,
        avatar: apiData.avatar || null,
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
        return { isValid: false, message: 'Por favor ingresa tu correo electronico' };
    }
    if (!email.includes('@')) {
        return { isValid: false, message: 'Por favor ingresa un correo valido' };
    }
    return { isValid: true, message: '' };
}

export function validatePassword(password: string): ValidationResult {
    if (!password.trim()) {
        return { isValid: false, message: 'Por favor ingresa tu contrasena' };
    }
    if (password.length < 4) {
        return { isValid: false, message: 'La contrasena debe tener al menos 4 caracteres' };
    }
    return { isValid: true, message: '' };
}
