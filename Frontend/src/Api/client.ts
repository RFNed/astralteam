import { APIError } from "./class/APIError"

const API_URL = import.meta.env.VITE_API_URL

interface RegisterInterface {
    username: string,
    email: string,
    password: string
}

export async function register(data: RegisterInterface)
{
    const response = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    if (!response.ok)
    {
        const message = await response.json()
        console.log(message.status)
        throw new APIError(
            message.detail.code,
            response.status
        )
    }

    return response.json()
}