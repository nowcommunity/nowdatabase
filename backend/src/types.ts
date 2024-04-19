import express from 'express'

export type Middleware = (req: express.Request, _res: express.Response, next: express.NextFunction) => void

export type Role = 'admin' | 'public' | 'edit-restricted' | 'edit'

export type User = {
  username: string
  role: Role
}
