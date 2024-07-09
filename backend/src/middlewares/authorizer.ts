import { Role } from '../../../frontend/src/types'
import { Middleware } from '../types'

class AccessError extends Error {
  declare status: number
  constructor() {
    super()
    this.message = 'User not authorized for the requested resource or action'
    this.status = 403
  }
}

export const requireOneOf = (roles: Role[]) => {
  const f: Middleware = (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) throw new AccessError()
    next()
  }
  return f
}
