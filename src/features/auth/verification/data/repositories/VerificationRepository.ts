import VerificationRemoteDataSource from '../network/VerificationRemoteDataSource';

export interface VerificationResult {
    success: boolean;
    data?: unknown;
    error?: string;
}

async function requestRegisterCode(email: string): Promise<VerificationResult> {
    return { success: true, data: await VerificationRemoteDataSource.requestRegisterCode(email) };
}

async function requestPasswordRecoveryCode(email: string): Promise<VerificationResult> {
    return { success: true, data: await VerificationRemoteDataSource.requestPasswordRecoveryCode(email) };
}

async function verifyCode(email: string, code: string): Promise<VerificationResult> {
    return { success: true, data: await VerificationRemoteDataSource.verifyCode(email, code) };
}

async function changePassword(email: string, password: string): Promise<VerificationResult> {
    return { success: true, data: await VerificationRemoteDataSource.changePassword(email, password) };
}

const VerificationRepository = {
    requestRegisterCode,
    requestPasswordRecoveryCode,
    verifyCode,
    changePassword,
};

export default VerificationRepository;
