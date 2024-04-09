import express from 'express'
import logger from './logger'

export const requestLogger = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
  const now = new Date()
  logger.info(`${now.toLocaleTimeString('FI-fi')} ${req.method} ${req.url}`)
  next()
}
