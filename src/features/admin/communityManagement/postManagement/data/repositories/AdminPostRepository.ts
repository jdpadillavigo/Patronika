import PublicationRemoteDataSource, { type Publication } from '../../../../../post/data/networking/PublicationRemoteDataSource';

async function loadPublications(refresh = false): Promise<Publication[]> {
    return PublicationRemoteDataSource.loadAll(refresh);
}

async function deletePublication(publicationId: string): Promise<void> {
    await PublicationRemoteDataSource.remove(publicationId);
}

async function clearPublicationReports(publicationId: string): Promise<void> {
    await PublicationRemoteDataSource.clearReports(publicationId);
}

const AdminPostRepository = {
    loadPublications,
    deletePublication,
    clearPublicationReports,
};

export default AdminPostRepository;
