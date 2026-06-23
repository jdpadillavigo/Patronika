import { getApiErrorMessage, type ApiResponseDto } from '../../../../../../core/data/network/dto/ApiResponseDto';
import type { AuthTokensDto } from './LoginDto';

export interface LoginResponseDto {
    success: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    error: string | null;
}

export function fromApiLoginResponse(apiResponse: ApiResponseDto<AuthTokensDto>): LoginResponseDto {
    if (apiResponse.success && apiResponse.data && typeof apiResponse.data !== 'string') {
        return {
            success: true,
            accessToken: apiResponse.data.accessToken || apiResponse.data.token || null,
            refreshToken: apiResponse.data.refreshToken || null,
            error: null,
        };
    }

    return {
        success: false,
        accessToken: null,
        refreshToken: null,
        error: getApiErrorMessage(apiResponse, 'Error al iniciar sesión'),
    };
}
