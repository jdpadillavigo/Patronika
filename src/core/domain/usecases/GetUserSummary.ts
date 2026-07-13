import UserRepository from '../../data/user/repositories/UserRepository';

export default function getUserSummary(id: string) {
    return UserRepository.getUserSummary(id);
}
