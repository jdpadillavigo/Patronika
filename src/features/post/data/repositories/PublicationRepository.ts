// Repositorio de publicaciones: intermedia entre los casos de uso y el datasource.
// Se encarga de obtener el userId del usuario en sesión antes de llamar al backend.
import HttpClient from '../../../../core/data/network/HttpClientExt';
import type { User } from '../../../../core/domain/models/User';
import PublicationRemoteDataSource, { type Publication } from '../networking/PublicationRemoteDataSource';

// Carga todas las publicaciones para el feed de Comunidad
async function loadFeed(): Promise<Publication[]> {
    return PublicationRemoteDataSource.loadAll();
}

// Crea una publicación asociando automáticamente el userId del usuario en sesión
async function create(
    patternId: string,
    description: string,
    technique: number,
    imageUri?: string | null,
): Promise<Publication> {
    const currentUser = await HttpClient.getCurrentUser<User>();
    if (!currentUser?.id) throw new Error('Inicia sesión nuevamente para publicar');
    return PublicationRemoteDataSource.create(currentUser.id, patternId, description, technique, imageUri);
}

// Elimina una publicación por id
async function remove(id: string): Promise<void> {
    return PublicationRemoteDataSource.remove(id);
}

const PublicationRepository = {
    loadFeed,
    create,
    remove,
};

export default PublicationRepository;
