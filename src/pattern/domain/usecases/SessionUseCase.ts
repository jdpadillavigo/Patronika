import AuthRepository from '../../data/repositories/AuthRepository';

async function getCurrentUser() {
    return AuthRepository.getSession();
}

async function logout(userId?: string | null): Promise<void> {
    return AuthRepository.logout(userId);
}

const SessionUseCase = {
    getCurrentUser,
    logout,
};

export default SessionUseCase;
