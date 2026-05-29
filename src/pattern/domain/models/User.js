/**
 * @param {object} apiData
 * @returns {object}
 */
export function createUser(apiData) {
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

/**
 * @param {string} username
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateUsername(username) {
    if (!username.trim()) {
        return { isValid: false, message: 'Por favor ingresa tu nombre de usuario' };
    }
    if (username.trim().length < 3) {
        return { isValid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
    }
    return { isValid: true, message: '' };
}

/**
 * @param {string} email
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateEmail(email) {
    if (!email.trim()) {
        return { isValid: false, message: 'Por favor ingresa tu correo electrónico' };
    }
    if (!email.includes('@')) {
        return { isValid: false, message: 'Por favor ingresa un correo válido' };
    }
    return { isValid: true, message: '' };
}

/**
 * @param {string} password
 * @returns {{ isValid: boolean, message: string }}
 */
export function validatePassword(password) {
    if (!password.trim()) {
        return { isValid: false, message: 'Por favor ingresa tu contraseña' };
    }
    if (password.length < 6) {
        return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    return { isValid: true, message: '' };
}
