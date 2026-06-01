export interface RegisterRequestDto {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    status: number;
    activateNotification: boolean;
}

export function createRegisterRequest(
    username: string,
    email: string,
    password: string,
): RegisterRequestDto {
    return {
        username,
        email,
        password,
        isAdmin: false,
        status: 1,
        activateNotification: true,
    };
}
