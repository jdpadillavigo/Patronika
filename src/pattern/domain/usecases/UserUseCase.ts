import UserRepository from '../../data/repositories/UserRepository';
import { isSessionExpiredError } from '../../../core/data/networking/ApiClient';
 
// Obtiene el listado completo de usuarios registrados (requiere rol admin en backend)
async function getAllUsers() {
    try {
        const users = await UserRepository.getAllUsers();
        return { success: true, data: users };
    } catch (error: unknown) {
        if (isSessionExpiredError(error)) {
            return { success: false, sessionExpired: true };
        }
        const message = error instanceof Error ? error.message : 'Error al cargar los usuarios';
        return { success: false, error: message };
    }
}
 
const UserUseCase = {
    getAllUsers,
};
 
export default UserUseCase;