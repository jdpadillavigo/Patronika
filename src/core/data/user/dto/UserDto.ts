export interface UserDto {
    id?: string;
    username: string;
    email: string;
    hashedPassword?: string;
    profileImageUrl?: string | null;
    isAdmin: boolean;
    loggedIn: boolean;
    status: number;
    registeredDate?: string;
    activateNotification: boolean;
    suspensionEndDate?: string | null;
    suspensionStartDate?: string | null;
    suspensionReason?: string | null;
    token?: string | null;
}

export interface UserRequestDto {
    username: string;
    email: string;
    password?: string;
    isAdmin: boolean;
    status: number;
    activateNotification: boolean;
    suspensionEndDate?: string | null;
}

export function createUserRequest(
    username: string,
    email: string,
    password: string,
    overrides: Partial<Omit<UserRequestDto, 'username' | 'email' | 'password'>> = {},
): UserRequestDto {
    return {
        username,
        email,
        password,
        isAdmin: overrides.isAdmin ?? false,
        status: overrides.status ?? 0,
        activateNotification: overrides.activateNotification ?? true,
        suspensionEndDate: overrides.suspensionEndDate ?? null,
    };
}
