export interface AuthRequestDto {
    username: string;
    password: string;
}

export interface RefreshTokenRequestDto {
    refreshToken: string;
}

export interface VerificationCodeRequestDto {
    email: string;
}

export interface VerifyCodeRequestDto {
    email: string;
    code: string;
}

export interface AuthTokensDto {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
}

export function createAuthRequest(username: string, password: string): AuthRequestDto {
    return { username, password };
}

export function createRefreshTokenRequest(refreshToken: string): RefreshTokenRequestDto {
    return { refreshToken };
}

export function createVerificationCodeRequest(email: string): VerificationCodeRequestDto {
    return { email };
}

export function createVerifyCodeRequest(email: string, code: string): VerifyCodeRequestDto {
    return { email, code };
}
