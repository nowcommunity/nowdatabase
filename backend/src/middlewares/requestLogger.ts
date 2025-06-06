import { logger } from '../utils/logger'
import { Middleware } from '../types'
import express from 'express'

declare module 'express-serve-static-core' {
  interface Request {
    start?: number
  }
}

export const requestLogger: Middleware = (req, _res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
}

export const responseLogger: Middleware = (req, res, next) => {
  const originalSend = res.send
  req.start = new Date().getTime()
  const getLogString = (req: express.Request) =>
    `${res.statusCode} ${req.method}\t${new Date().getTime() - (req.start ?? 0)} ms\t${req.baseUrl}${req.url} ${req.user ? `Username: '${req.user.username}'` : ''}`
  res.send = function (body) {
    logger.info(getLogString(req))
    return originalSend.call(this, body)
  }
  next()
}
