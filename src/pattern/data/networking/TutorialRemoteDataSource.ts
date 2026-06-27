import ApiClient, { type ApiResponse } from '../../../core/data/networking/ApiClient';
import { assertApiSuccess } from './dto/ApiResponseDto';

export interface Tutorial {
    id: string;
    title: string;
    description: string;
    url: string;
}

async function getAll(): Promise<Tutorial[]> {
    const response = await ApiClient.get<ApiResponse<Tutorial[]>>('/api/tutorials');
    return assertApiSuccess(response, 'No se pudieron cargar los tutoriales') || [];
}

const TutorialRemoteDataSource = {
    getAll,
};

export default TutorialRemoteDataSource;
