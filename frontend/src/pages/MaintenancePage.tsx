import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Role } from '@/shared/types'
import { useUser } from '@/hooks/user'
import { useDisableMaintenanceModeMutation } from '@/redux/maintenanceReducer'
import { useNotify } from '@/hooks/notification'

type StoredMaintenanceInfo = {
  enabledAt: string | null
  reason: string | null
}

const readStoredMaintenanceInfo = (): StoredMaintenanceInfo => {
  const raw = sessionStorage.getItem('nowdb_maintenance')
  if (!raw) return { enabledAt: null, reason: null }
  try {
    const parsed = JSON.parse(raw) as Partial<StoredMaintenanceInfo>
    return {
      enabledAt: typeof parsed.enabledAt === 'string' ? parsed.enabledAt : null,
      reason: typeof parsed.reason === 'string' ? parsed.reason : null,
    }
  } catch {
    return { enabledAt: null, reason: null }
  }
}

export const MaintenancePage = () => {
  const user = useUser()
  const navigate = useNavigate()
  const { notify } = useNotify()
  const [disableMaintenance, { isLoading }] = useDisableMaintenanceModeMutation()

  const [stored] = useState(() => readStoredMaintenanceInfo())
  const isAdmin = user.role === Role.Admin

  const header = useMemo(() => {
    if (!stored.reason) return 'Maintenance mode'
    return 'Maintenance mode (Emergency shutdown)'
  }, [stored.reason])

  const handleDisable = async () => {
    try {
      await disableMaintenance().unwrap()
      sessionStorage.removeItem('nowdb_maintenance')
      notify('Maintenance mode disabled', 'success')
      navigate('/')
    } catch {
      notify('Failed to disable maintenance mode', 'error')
    }
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Stack gap={2} sx={{ maxWidth: '50em', margin: '0 auto' }}>
        <Typography variant="h4">{header}</Typography>
        <Divider />
        <Typography>
          The service is temporarily unavailable. If this is unexpected, please contact an administrator.
        </Typography>

        {stored.enabledAt && (
          <Typography color="text.secondary">
            Enabled at: <code>{stored.enabledAt}</code>
          </Typography>
        )}

        {stored.reason && (
          <Typography>
            Reason: <strong>{stored.reason}</strong>
          </Typography>
        )}

        <Stack direction="row" gap={1}>
          <Button variant="outlined" component={Link} to="/login">
            Admin login
          </Button>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Stack>

        {isAdmin && (
          <>
            <Divider />
            <Typography variant="h6">Admin</Typography>
            <Stack direction="row" gap={1}>
              <Button variant="contained" onClick={() => void handleDisable()} disabled={isLoading}>
                Disable maintenance mode
              </Button>
              <Button variant="outlined" component={Link} to="/admin/emergency-shutdown">
                Emergency shutdown settings
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  )
}
