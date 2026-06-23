export interface VerificationCodeRequestDto {
    email: string;
}

export interface VerifyCodeRequestDto {
    email: string;
    code: string;
}

export interface ChangePasswordRequestDto {
    email: string;
    password: string;
}

export function createVerificationCodeRequest(email: string): VerificationCodeRequestDto {
    return { email };
}

export function createVerifyCodeRequest(email: string, code: string): VerifyCodeRequestDto {
    return { email, code };
}

export function createChangePasswordRequest(email: string, password: string): ChangePasswordRequestDto {
    return { email, password };
}
