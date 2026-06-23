import LoginRepository from '../../data/repositories/LoginRepository';

async function getCurrentUser() {
    return LoginRepository.getSession();
}

async function logout(userId?: string | null): Promise<void> {
    return LoginRepository.logout(userId);
}

const SessionUseCase = {
    getCurrentUser,
    logout,
};

export default SessionUseCase;
