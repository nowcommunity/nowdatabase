import type { Middleware } from '../types'
import { getMaintenanceState } from '../utils/maintenanceMode'

const isAllowedPathDuringMaintenance = (path: string): boolean => {
  if (path === '/version') return true
  if (path === '/refreshToken') return true

  if (path === '/user/login') return true
  if (path === '/user/password') return true

  if (path.startsWith('/admin/maintenance')) return true

  return false
}

export const maintenanceGate: Middleware = (req, res, next) => {
  if (req.method === 'OPTIONS') return next()

  const maintenance = getMaintenanceState()
  if (!maintenance.enabled) return next()

  if (isAllowedPathDuringMaintenance(req.path)) return next()

  return res.status(503).json({
    maintenance: true,
    enabledAt: maintenance.enabledAt,
    reason: maintenance.reason,
  })
}
