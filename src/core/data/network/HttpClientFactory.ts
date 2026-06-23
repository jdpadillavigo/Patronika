export interface HttpClientConfig {
    requestTimeoutMs?: number;
    enableLogging?: boolean;
}

export interface HttpClientTransport {
    execute(url: string, request: RequestInit): Promise<Response>;
}

export class HttpTimeoutError extends Error {
    constructor() {
        super('La solicitud tardó demasiado. Intenta nuevamente.');
        this.name = 'HttpTimeoutError';
    }
}

class FetchHttpClient implements HttpClientTransport {
    constructor(private readonly config: Required<HttpClientConfig>) {}

    async execute(url: string, request: RequestInit): Promise<Response> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);
        const startedAt = Date.now();

        try {
            const response = await fetch(url, {
                ...request,
                headers: {
                    Accept: 'application/json',
                    ...request.headers,
                },
                signal: controller.signal,
            });

            if (this.config.enableLogging) {
                console.log(`[HTTP] ${request.method || 'GET'} ${url} -> ${response.status} (${Date.now() - startedAt} ms)`);
            }

            return response;
        } catch (error: unknown) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw new HttpTimeoutError();
            }
            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }
}

export const HttpClientFactory = {
    create(config: HttpClientConfig = {}): HttpClientTransport {
        return new FetchHttpClient({
            requestTimeoutMs: config.requestTimeoutMs ?? 15_000,
            enableLogging: config.enableLogging ?? (typeof __DEV__ !== 'undefined' && __DEV__),
        });
    },
};

export default HttpClientFactory;
