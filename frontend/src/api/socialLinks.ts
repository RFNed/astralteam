type Socials = {
    github: string
}

export async function socialLinks(): Promise<Socials>
{

    const response = await fetch(`${import.meta.env.VITE_API_URL}/socials`)

    const data: Socials = await response.json()


    return {
        github: data.github
    }
}