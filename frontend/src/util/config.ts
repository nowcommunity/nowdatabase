export const ENV = import.meta.env.VITE_RUNNING_ENV as 'dev' | 'staging' | 'prod'
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string
export const ENABLE_WRITE = import.meta.env.VITE_ENABLE_WRITE === 'true'
