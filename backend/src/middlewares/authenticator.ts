import { Middleware, User } from '../types'

/*
  This allows extractors to add user and token to request
*/
declare module 'express-serve-static-core' {
  interface Request {
    token?: string | null
    user: User
  }
}

export const tokenExtractor: Middleware = (req, _res, next) => {
  const authorization = req.get('authorization')
  req.token = authorization && authorization.toLowerCase().startsWith('bearer ') ? authorization.substring(7) : null
  next()
}
