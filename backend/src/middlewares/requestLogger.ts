import { logger } from '../utils/logger'
import { Middleware } from '../types'
import express from 'express'

export const requestLogger: Middleware = (req, _res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
}

export const responseLogger: Middleware = (req, res, next) => {
  const originalJson = res.json
  const getLogString = (req: express.Request) =>
    `${res.statusCode} ${req.method} ${req.baseUrl}${req.url} ${req.user ? `Username: '${req.user.username}'` : ''}`
  res.json = function (body) {
    logger.info(getLogString(req))
    return originalJson.call(this, body)
  }

  next()
}
