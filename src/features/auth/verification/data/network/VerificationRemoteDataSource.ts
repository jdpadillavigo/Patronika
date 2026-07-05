import HttpClient, { type ApiResponse } from '../../../../../core/data/network/HttpClientExt';
import {
    createChangePasswordRequest,
    createVerificationCodeRequest,
    createVerifyCodeRequest,
} from './dto/VerificationDto';

function readMessage(response: ApiResponse<string>, fallback: string): string {
    return typeof response.data === 'string' && response.data.trim() ? response.data : fallback;
}

async function requestRegisterCode(email: string): Promise<string> {
    const response = await HttpClient.post<ApiResponse<string>>(
        '/api/auth/register/request-code',
        createVerificationCodeRequest(email),
        { requiresAuth: false },
    );
    return readMessage(response, 'Código enviado al correo');
}

async function requestPasswordRecoveryCode(email: string): Promise<string> {
    const response = await HttpClient.post<ApiResponse<string>>(
        '/api/auth/modify-password/request-code',
        createVerificationCodeRequest(email),
        { requiresAuth: false },
    );
    return readMessage(response, 'Código enviado al correo');
}

async function requestEmailChangeCode(email: string): Promise<string> {
    const response = await HttpClient.post<ApiResponse<string>>(
        '/api/users/change-email/request-code',
        createVerificationCodeRequest(email),
    );
    return readMessage(response, 'Código enviado al correo');
}

async function verifyCode(email: string, code: string): Promise<string> {
    const response = await HttpClient.post<ApiResponse<string>>(
        '/api/auth/verify-code',
        createVerifyCodeRequest(email, code),
        { requiresAuth: false },
    );
    return readMessage(response, 'Código verificado correctamente');
}

async function changePassword(email: string, password: string): Promise<string> {
    const response = await HttpClient.post<ApiResponse<string>>(
        '/api/auth/forgot-password',
        createChangePasswordRequest(email, password),
        { requiresAuth: false },
    );
    return readMessage(response, 'Contraseña restablecida correctamente');
}

const VerificationRemoteDataSource = {
    requestRegisterCode,
    requestPasswordRecoveryCode,
    requestEmailChangeCode,
    verifyCode,
    changePassword,
};

export default VerificationRemoteDataSource;
