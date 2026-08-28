export const IS_DEBUG = import.meta.env.VITE_DEBUG === "True" ? true : false
export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}