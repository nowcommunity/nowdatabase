export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? 'http://localhost:4000/'
export const ENV = import.meta.env.VITE_RUNNING_ENV as 'dev' | 'staging' | 'prod'
export const ENABLE_WRITE = import.meta.env.ENABLE_WRITE === 'true'
