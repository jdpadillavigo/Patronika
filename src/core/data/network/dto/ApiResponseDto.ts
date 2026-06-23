export interface ApiResponseDto<T> {
    success: boolean;
    data?: T | string | null;
}

export function getApiErrorMessage(response: ApiResponseDto<unknown>, fallback: string): string {
    return typeof response.data === 'string' && response.data.trim()
        ? response.data
        : fallback;
}

export function assertApiSuccess<T>(response: ApiResponseDto<T>, fallback: string): T | null {
    if (!response.success) {
        throw new Error(getApiErrorMessage(response, fallback));
    }

    return typeof response.data === 'string'
        ? null
        : response.data ?? null;
}
