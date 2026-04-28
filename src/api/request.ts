const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export class ApiError extends Error {
    status: number;
    code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

type RequestOptions = RequestInit & {
    token?: string;
};

export async function request<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const { token, headers, ...rest } = options;

    const response = await fetch(`${BASE_URL}${path}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(
            json?.error?.message ?? 'Request failed',
            response.status,
            json?.error?.code,
        );
    }

    return json as T;
}
