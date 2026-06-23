import { getApiErrorMessage, type ApiResponseDto } from '../../../../../../core/data/network/dto/ApiResponseDto';
import type { UserDto } from '../../../../../../core/data/user/dto/UserDto';

export interface RegisterResponseDto {
    success: boolean;
    user: UserDto | null;
    error: string | null;
}

export function fromApiRegisterResponse(apiResponse: ApiResponseDto<UserDto>): RegisterResponseDto {
    if (apiResponse.success && apiResponse.data && typeof apiResponse.data !== 'string') {
        return {
            success: true,
            user: apiResponse.data,
            error: null,
        };
    }

    return {
        success: false,
        user: null,
        error: getApiErrorMessage(apiResponse, 'Error al crear la cuenta'),
    };
}
