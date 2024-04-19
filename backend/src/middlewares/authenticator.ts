import { Middleware, User } from '../types'
import { SECRET } from '../utils/config'
import jwt, { Secret, TokenExpiredError } from 'jsonwebtoken'
import { models } from '../utils/db'

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

const verify = async (token: string, secret: Secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err)
      else resolve(decoded)
    })
  })
}

export const userExtractor: Middleware = async (req, res, next) => {
  if (req.token === undefined || req.token === null) {
    return next()
  }

  try {
    const decodedUser = (await verify(req.token, SECRET as Secret)) as { username: string }
    const username = decodedUser.username
    if (!username) throw new Error('Invalid token')

    const foundUser = await models.com_users.findOne({
      attributes: ['user_name'],
      where: { user_name: username },
      raw: true,
    })

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid user' })
    }
    req.user = { username: foundUser.user_name!, role: 'admin' }
    return next()
  } catch (e: unknown) {
    if (e instanceof TokenExpiredError) {
      return res.status(400).json({ message: 'Token expired' })
    }
    next(e)
  }
}
