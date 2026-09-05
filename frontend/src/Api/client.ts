import { APIError } from "./class/APIError"

const API_URL = import.meta.env.VITE_API_URL

interface APIResponse<T = undefined> {
    detail: {
        code: string,
        message: string,
        data?: T
    }
}

interface ParseUserInterface {
    id: string
    username: string
    avatar_url: {
        "url": string
        "type": string 
    }
    "email": string
}

interface AuthInterface {
    username: string
    password: string
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
        "credentials": "include",
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

export async function register(data: RegisterInterface) {
    return request<undefined>("/user/register", {
        method: "POST",
        body: JSON.stringify(data)
    })
}

export async function auth(data: AuthInterface) {
    return request<undefined>("/user/auth", {
        method: "POST",
        body: JSON.stringify(data)
    })
}

export async function verifyEmail(token: string) {
    return request<undefined>("/user/verify-email", {
        method: "POST",
        body: JSON.stringify({ token })
    })
}

export async function parseBySession() {
    return request<ParseUserInterface>("/user/me", {
        method: "GET"
    })
}