export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface RefreshTokenRequestDto {
    refreshToken: string;
}

export interface AuthTokensDto {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
}

export function createLoginRequest(username: string, password: string): LoginRequestDto {
    return { username, password };
}

export function createRefreshTokenRequest(refreshToken: string): RefreshTokenRequestDto {
    return { refreshToken };
}
