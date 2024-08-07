import express from 'express'
import { logger } from '../utils/logger'
import { JsonWebTokenError } from 'jsonwebtoken'

export const errorHandler = (
  error: Error,
  _req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: express.NextFunction
) => {
  if ('status' in error && error.status !== 500) {
    return res.status(error.status as number).json({ message: error.message })
  }

  if (error instanceof JsonWebTokenError) {
    return res.status(400).json({ message: 'Authentication token was invalid' })
  }

  logger.error('Internal server error occurred. Error and stacktrace:')
  logger.error(error.message)
  if (error.stack) logger.error(error.stack)
  return res.status(500).json(`Internal server error: ${JSON.stringify(error, null, 2)}`)
}
