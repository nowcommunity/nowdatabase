export const IS_LOCAL = import.meta.env.VITE_IS_LOCAL
export const BACKEND_URL = IS_LOCAL ? 'http://localhost:4000/' : import.meta.env.VITE_BACKEND_URL

