import { Router, type Request } from 'express'
import { disableMaintenanceMode, enableMaintenanceMode, getMaintenanceState } from '../utils/maintenanceMode'

const router = Router()

router.get('/', (_req, res) => {
  return res.status(200).json(getMaintenanceState())
})

router.post('/enable', (req: Request<object, object, { reason?: string }>, res) => {
  const reason = typeof req.body.reason === 'string' ? req.body.reason : null
  const enabledBy = req.user?.username ?? null
  return res.status(200).json(enableMaintenanceMode(reason, enabledBy))
})

router.post('/disable', (req, res) => {
  const previous = getMaintenanceState()
  const next = disableMaintenanceMode()
  res.status(200).json({ ...next, disabledBy: req.user?.username ?? null, previouslyEnabledAt: previous.enabledAt })
})

export default router
