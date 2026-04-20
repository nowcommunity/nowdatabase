import fs from 'fs'

export type MaintenanceState = {
  enabled: boolean
  enabledAt: string | null
  reason: string | null
  enabledBy: string | null
}

const resolveStateFilePath = (): string => {
  return process.env.NOWDB_MAINTENANCE_STATE_FILE ?? process.env.MAINTENANCE_STATE_FILE ?? '/tmp/nowdb-maintenance.json'
}

const parsePersistedState = (raw: string): MaintenanceState | null => {
  try {
    const parsed = JSON.parse(raw) as Partial<MaintenanceState>
    if (typeof parsed.enabled !== 'boolean') return null
    return {
      enabled: parsed.enabled,
      enabledAt: typeof parsed.enabledAt === 'string' ? parsed.enabledAt : null,
      reason: typeof parsed.reason === 'string' ? parsed.reason : null,
      enabledBy: typeof parsed.enabledBy === 'string' ? parsed.enabledBy : null,
    }
  } catch {
    return null
  }
}

const loadInitialState = (): MaintenanceState => {
  const stateFilePath = resolveStateFilePath()
  if (fs.existsSync(stateFilePath)) {
    const persisted = parsePersistedState(fs.readFileSync(stateFilePath, 'utf8'))
    if (persisted) return persisted
  }

  const enabledFromEnv =
    process.env.NOWDB_MAINTENANCE_MODE === 'true' ||
    process.env.MAINTENANCE_MODE === 'true' ||
    process.env.VITE_MAINTENANCE_MODE === 'true'

  return {
    enabled: enabledFromEnv,
    enabledAt: enabledFromEnv ? new Date().toISOString() : null,
    reason:
      process.env.NOWDB_MAINTENANCE_REASON ??
      process.env.MAINTENANCE_REASON ??
      process.env.VITE_MAINTENANCE_REASON ??
      null,
    enabledBy: null,
  }
}

let state: MaintenanceState = loadInitialState()

export const getMaintenanceState = (): MaintenanceState => ({ ...state })

const persistState = (nextState: MaintenanceState) => {
  const stateFilePath = resolveStateFilePath()
  try {
    fs.writeFileSync(stateFilePath, `${JSON.stringify(nextState)}\n`, { encoding: 'utf8' })
  } catch {
    // Best-effort: emergency mode must still work even if the filesystem is read-only.
  }
}

export const enableMaintenanceMode = (reason: string | null, enabledBy: string | null): MaintenanceState => {
  state = {
    enabled: true,
    enabledAt: new Date().toISOString(),
    reason: reason && reason.trim() !== '' ? reason.trim() : null,
    enabledBy: enabledBy && enabledBy.trim() !== '' ? enabledBy.trim() : null,
  }
  persistState(state)
  return getMaintenanceState()
}

export const disableMaintenanceMode = (): MaintenanceState => {
  state = { enabled: false, enabledAt: null, reason: null, enabledBy: null }
  persistState(state)
  return getMaintenanceState()
}
