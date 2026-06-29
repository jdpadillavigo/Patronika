// Capa de datos: comunicación directa con el backend para publicaciones.
// Usa HttpClientExt (maneja tokens Bearer y refresco de sesión automáticamente).
import HttpClient, { type ApiResponse } from '../../../../core/data/network/HttpClientExt';
import { assertApiSuccess } from '../../../../core/data/network/dto/ApiResponseDto';

// Tipos que espeja el backend (GET /api/publications)
export interface PublicationUser {
    id: string;
    username: string;
    profileImageUrl?: string | null; // foto de perfil del autor
}

export interface PublicationPattern {
    id: string;
    name: string;
    gridData?: string | null; // JSON del grid; se convierte a imagen en el frontend
    width: number;
    height: number;
}

export interface Publication {
    id: string;
    user: PublicationUser;
    patternId: string;
    pattern?: PublicationPattern | null;
    description: string;
    technique: number; // 0=Crochet, 1=Tejido a dos agujas, 2=Bordado, 3=Macramé, 4=Otros
    imageUrl?: string | null; // foto opcional subida por el usuario
    publishedAt?: string | null;
}

// GET /api/publications — devuelve todas las publicaciones de la comunidad
async function loadAll(): Promise<Publication[]> {
    const response = await HttpClient.get<ApiResponse<Publication[]>>('/api/publications');
    return assertApiSuccess(response, 'No se pudo cargar el feed') || [];
}

// POST /api/publications — crea una nueva publicación con multipart/form-data.
// El backend espera:
//   - parte "publication": JSON con userId, patternId, description, technique
//   - parte "file" (opcional): imagen JPG/PNG del resultado físico
async function create(
    userId: string,
    patternId: string,
    description: string,
    technique: number,
    imageUri?: string | null,
): Promise<Publication> {
    const formData = new FormData();

    // La parte JSON debe enviarse con type: 'application/json' para que Spring Boot
    // lo reconozca como @RequestPart
    formData.append('publication', {
        string: JSON.stringify({ userId, patternId, description, technique }),
        type: 'application/json',
        name: 'publication',
    } as unknown as Blob);

    if (imageUri) {
        const ext = imageUri.split('.').pop()?.toLowerCase();
        const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
        formData.append('file', {
            uri: imageUri,
            name: imageUri.split('/').pop() || `pub-${Date.now()}.jpg`,
            type: mimeType,
        } as unknown as Blob);
    }

    const response = await HttpClient.post<ApiResponse<Publication>>('/api/publications', formData);
    const pub = assertApiSuccess(response, 'No se pudo crear la publicación');
    if (!pub) throw new Error('No se pudo crear la publicación');
    return pub;
}

// DELETE /api/publications/{id}
async function remove(id: string): Promise<void> {
    await HttpClient.delete<ApiResponse<string>>(`/api/publications/${id}`);
}

const PublicationRemoteDataSource = {
    loadAll,
    create,
    remove,
};

export default PublicationRemoteDataSource;
