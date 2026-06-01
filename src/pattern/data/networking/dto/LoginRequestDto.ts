export interface LoginRequestDto {
    username: string;
    password: string;
}

export function createLoginRequest(username: string, password: string): LoginRequestDto {
    return { username, password };
}
