import HttpClient, { type ApiResponse } from '../../../../core/data/network/HttpClientExt';
import { assertApiSuccess } from '../../../../core/data/network/dto/ApiResponseDto';

export interface Tutorial {
    id: string;
    title: string;
    description: string;
    url: string;
}

async function getAll(): Promise<Tutorial[]> {
    const response = await HttpClient.get<ApiResponse<Tutorial[]>>('/api/tutorials');
    return assertApiSuccess(response, 'No se pudieron cargar los tutoriales') || [];
}

const TutorialRemoteDataSource = {
    getAll,
};

export default TutorialRemoteDataSource;
