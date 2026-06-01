export interface RegisterResponseDto {
    success: boolean;
    message: string | null;
    error: string | null;
}

interface ApiRegisterRawResponse {
    success: boolean;
    data?: string;
    message?: string;
}

export function fromApiRegisterResponse(apiResponse: ApiRegisterRawResponse): RegisterResponseDto {
    if (apiResponse.success) {
        return {
            success: true,
            message: apiResponse.data || 'Cuenta creada exitosamente',
            error: null,
        };
    }

    return {
        success: false,
        message: null,
        error: apiResponse.data || apiResponse.message || 'Error al crear la cuenta',
    };
}
