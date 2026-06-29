import TutorialRemoteDataSource, { type Tutorial, type TutorialRequest } from '../networking/TutorialRemoteDataSource';

async function getAll(): Promise<Tutorial[]> {
    return TutorialRemoteDataSource.getAll();
}

async function getById(id: string): Promise<Tutorial> {
    return TutorialRemoteDataSource.getById(id);
}

async function create(request: TutorialRequest): Promise<Tutorial> {
    return TutorialRemoteDataSource.create(request);
}

async function update(id: string, request: TutorialRequest): Promise<void> {
    return TutorialRemoteDataSource.update(id, request);
}

async function remove(id: string): Promise<void> {
    return TutorialRemoteDataSource.remove(id);
}

const TutorialRepository = {
    getAll,
    getById,
    create,
    update,
    remove,
};

export default TutorialRepository;
