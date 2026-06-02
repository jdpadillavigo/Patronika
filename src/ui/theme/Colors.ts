const Colors = {
    // Colores principales
    primary: '#763A6C',     // Morado
    gray: '#C8C7CC',        // Gris
    white: '#FFFFFF',       // Blanco
    black: '#000000',       // Negro

    // Colores de estado
    error: '#EF4444',       // Rojo — errores y validaciones
    errorBg: 'rgba(239, 68, 68, 0.1)',
    success: '#10B981',     // Verde — confirmaciones
    warning: '#F59E0B',     // Amarillo — advertencias
    info: '#3B82F6',        // Azul — información

    // Modo Claro
    light: {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: '#000000',
        textSecondary: '#6B7280',
        inputBackground: '#F9FAFB',
        inputBorder: '#D1D5DB',
        divider: '#E5E7EB',
    },

    // Modo Oscuro
    dark: {
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F1F5F9',
        textSecondary: '#94A3B8',
        inputBackground: '#0F172A',
        inputBorder: '#334155',
        divider: '#334155',
    },
} as const;

export default Colors;
