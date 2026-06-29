export type RootStackParamList = {
    Onboarding: undefined;
    Login: undefined;
    Register: undefined;
    Registro: undefined;
    Home: undefined;
    MisPatrones: undefined;
    GenerarPatron: undefined;
    Formulario: { imageUri?: string | null };
    VistaPrevia: {
        imageUri?: string | null;
        patronUrl?: string | null;
        nombre?: string;
        tamano?: number;
        pattern?: unknown;
    };
    Perfil: {
        isAdmin?: boolean;
    } | undefined;
    GestionUsuarios: undefined;
    AgregarUsuarioAdmin: undefined;
    EditarUsuarioAdmin: {
        userId: string | null;
    };
    GestionComunidadAdmin: undefined;
    SancionarEliminarPublicacionAdmin: {
        publicationId: string;
        publicationName?: string;
    };
    GestionTutorialesAdmin: undefined;
    AgregarTutorialAdmin: undefined;
    EditarTutorialAdmin: {
        tutorialId: string | null;
    };
    OlvidasteContrasena: undefined;
    VerificarCorreo: {
        mode?: 'register' | 'recovery';
        email?: string;
        username?: string;
        password?: string;
        profileImageUri?: string | null;
    };
    RestablecerContrasena: {
        email?: string;
    };
    TermsAndConditions: {
        kind?: 'app' | 'camera';
    };
    Comunidad: undefined;
    PublicacionDetalle: {
        publicationId: string;
        publication?: unknown;
    };
    CrearPublicacion: undefined;
    Tutoriales: undefined;
};
