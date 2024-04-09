import express from 'express'
import logger from './logger'

export const requestLogger = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
  logger.info(`${req.method} ${req.url}`)
  next()
}
