import TutorialRemoteDataSource, { type Tutorial } from '../networking/TutorialRemoteDataSource';

async function getAll(): Promise<Tutorial[]> {
    return TutorialRemoteDataSource.getAll();
}

const TutorialRepository = {
    getAll,
};

export default TutorialRepository;
