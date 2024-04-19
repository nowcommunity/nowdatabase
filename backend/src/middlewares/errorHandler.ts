import express from 'express'
import { logger } from '../utils/logger'

export const errorHandler = (
  error: Error,
  _req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: express.NextFunction
) => {
  logger.info('error handler')
  if ('status' in error) {
    return res.status(error.status as number).json({ message: error.message })
  }
  logger.error('Internal server error occurred. Error and stacktrace:')
  logger.error(error.message)
  if (error.stack) logger.error(error.stack)
  return res.status(500).json('Internal server error: ' + error)
}
