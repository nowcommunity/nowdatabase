import { Middleware } from '../types'
import { SECRET } from '../utils/config'
import jwt, { Secret, TokenExpiredError } from 'jsonwebtoken'
import { nowDb } from '../utils/db'
import { User } from '../../../frontend/src/backendTypes'
import { Role } from '../../../frontend/src/types'

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

export const getRole = (userGroup: string) => {
  const userGroupToRole = {
    su: Role.Admin,
    eu: Role.EditUnrestricted,
    er: Role.EditRestricted,
    pl: Role.Project,
    plp: Role.ProjectPrivate,
    no: Role.NowOffice,
    ro: Role.ReadOnly,
  } as Record<string, Role | undefined>

  return userGroupToRole[userGroup] ?? Role.ReadOnly
}

export const userExtractor: Middleware = async (req, res, next) => {
  if (req.token === undefined || req.token === null) {
    return next()
  }

  try {
    const decodedUser = (await verify(req.token, SECRET as Secret)) as { username: string }
    const username = decodedUser.username
    if (!username) throw new Error('Invalid token')

    const foundUser = await nowDb.com_users.findFirst({
      select: { user_name: true, now_user_group: true, user_id: true },
      where: { user_name: username },
    })

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid user' })
    }

    const foundPerson = await nowDb.com_people.findFirst({
      select: { initials: true },
      where: { user_id: foundUser.user_id },
    })
    if (!foundPerson) throw new Error('Found user, but not persons initials. Unexpected error.')
    req.user = {
      username: foundUser.user_name!,
      role: getRole(foundUser.now_user_group ?? ''),
      userId: foundUser.user_id,
      initials: foundPerson?.initials,
    }

    return next()
  } catch (e: unknown) {
    if (e instanceof TokenExpiredError) {
      return res.status(400).json({ message: 'Token expired' })
    }
    next(e)
  }
}

export const requireLogin: Middleware = (req, _res, next) => {
  if (!req.user) throw Error('Login currently required for all data')
  next()
}
