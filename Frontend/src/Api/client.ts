import { APIError } from "./class/APIError"

const API_URL = import.meta.env.VITE_API_URL

interface APIResponse<T> {
    data: T
}

interface RegisterInterface {
    username: string
    email: string
    password: string
}

async function request<T>(endpoint: string,options: RequestInit = {}): Promise<APIResponse<T>> 
{
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    })

    const data = await response.json()

    if (!response.ok) {
        throw new APIError(
            data.detail.code,
            response.status
        )
    }

    return data
}

export function register(data: RegisterInterface) {
    return request<RegisterInterface>("/user/register", {
        method: "POST",
        body: JSON.stringify(data)
    })
}

export function verifyEmail(token: string) {
    return request<string>("/verify-email", {
        method: "POST",
        body: JSON.stringify(token)
    })
}