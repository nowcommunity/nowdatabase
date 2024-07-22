import { Middleware } from '../types'

/* Disables all write routes except the ones excluded by "allowedRoutes" */
export const blockWriteRequests: Middleware = (req, res, next) => {
  const allowedRoutes = ['/user/login', '/locality-species', '/refreshToken', '/user/password', '/user/create']
  const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

  if (writeMethods.includes(req.method) && !allowedRoutes.includes(req.path)) {
    return res.status(403).send()
  }
  return next()
}
