import express from 'express'
import { logger } from './logger'

export const errorHandler = (error: Error, _req: express.Request, res: express.Response) => {
  if ('status' in error) {
    return res.status(error.status as number).json({ message: error.message })
  }
  logger.error('Internal server error occurred. Error and stacktrace:')
  logger.error(error.message)
  if (error.stack) logger.error(JSON.stringify(error.stack, null, 2))
  return res.status(500).json('Internal server error: ' + error)
}
