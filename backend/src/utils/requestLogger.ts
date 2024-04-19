import { logger } from './logger'
import { Middleware } from '../types'

export const requestLogger: Middleware = (req, _res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
}

export const responseLogger: Middleware = (req, res, next) => {
  const originalJson = res.json
  res.json = function (body) {
    logger.info(`${res.statusCode} ${req.method} ${req.baseUrl}${req.url}`)
    return originalJson.call(this, body)
  }
  next()
}
