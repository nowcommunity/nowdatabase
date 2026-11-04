import { Middleware } from '../types'
import { invalidateLocalityListCache } from '../services/locality'

const READ_ONLY_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

// Locality data can be changed from many write paths (localities, projects, species, time units, ...),
// so the cached locality list is dropped after every write request.
export const invalidateLocalityListCacheAfterWrites: Middleware = (req, res, next) => {
  if (!READ_ONLY_METHODS.has(req.method)) {
    res.on('finish', invalidateLocalityListCache)
  }
  next()
}
