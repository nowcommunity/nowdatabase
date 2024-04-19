import express from 'express'

export type Middleware = (req: express.Request, _res: express.Response, next: express.NextFunction) => void
