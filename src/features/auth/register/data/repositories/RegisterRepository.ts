import LoginRepository, { type AuthResult } from '../../../login/data/repositories/LoginRepository';
import RegisterRemoteDataSource from '../network/RegisterRemoteDataSource';

async function register(
    username: string,
    email: string,
    password: string,
    profileImageUri?: string | null,
): Promise<AuthResult> {
    await RegisterRemoteDataSource.register(username, email, password, profileImageUri);
    return LoginRepository.login(username, password);
}

const RegisterRepository = { register };

export type { AuthResult };
export default RegisterRepository;
