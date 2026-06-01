export interface LoginResponseDto {
    success: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    error: string | null;
}

interface ApiLoginRawResponse {
    success: boolean;
    data?: {
        accessToken?: string;
        token?: string;
        refreshToken?: string;
    };
    message?: string;
}

export function fromApiLoginResponse(apiResponse: ApiLoginRawResponse): LoginResponseDto {
    if (apiResponse.success && apiResponse.data) {
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
        error: (apiResponse.data as unknown as string) || apiResponse.message || 'Error al iniciar sesión',
    };
}
