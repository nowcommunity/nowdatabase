import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { Role } from '@/shared/types'
import { useUser } from '@/hooks/user'
import { useNotify } from '@/hooks/notification'
import {
  useDisableMaintenanceModeMutation,
  useEnableMaintenanceModeMutation,
  useGetMaintenanceStateQuery,
} from '@/redux/maintenanceReducer'

export const EmergencyShutdownPage = () => {
  const user = useUser()
  const { notify } = useNotify()

  const isAdmin = user.role === Role.Admin
  const { data, isFetching, refetch } = useGetMaintenanceStateQuery(undefined, { skip: !isAdmin })

  const [reason, setReason] = useState('')
  const [enableMaintenance, { isLoading: enabling }] = useEnableMaintenanceModeMutation()
  const [disableMaintenance, { isLoading: disabling }] = useDisableMaintenanceModeMutation()

  const currentEnabled = Boolean(data?.enabled)
  const enabledAt = data?.enabledAt ?? null

  const statusText = useMemo(() => {
    if (!isAdmin) return 'Not authorized'
    if (isFetching) return 'Loading...'
    return currentEnabled ? 'ENABLED' : 'DISABLED'
  }, [currentEnabled, isAdmin, isFetching])

  if (!isAdmin) {
    return <Box>Your user is not authorized to view this page.</Box>
  }

  document.title = 'Emergency shutdown'

  const handleEnable = async () => {
    try {
      await enableMaintenance({ reason }).unwrap()
      notify('Maintenance mode enabled', 'success')
      void refetch()
    } catch {
      notify('Failed to enable maintenance mode', 'error')
    }
  }

  const handleDisable = async () => {
    try {
      await disableMaintenance().unwrap()
      sessionStorage.removeItem('nowdb_maintenance')
      notify('Maintenance mode disabled', 'success')
      void refetch()
    } catch {
      notify('Failed to disable maintenance mode', 'error')
    }
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Stack gap={2} sx={{ maxWidth: '50em', margin: '0 auto' }}>
        <Typography variant="h4">Emergency shutdown</Typography>
        <Typography color="text.secondary">
          When enabled, the backend returns <code>503</code> for normal API routes. Admin maintenance endpoints remain
          available so you can disable the mode.
        </Typography>
        <Divider />

        <Typography>
          Status: <strong>{statusText}</strong>
        </Typography>

        {enabledAt && (
          <Typography color="text.secondary">
            Enabled at: <code>{enabledAt}</code>
          </Typography>
        )}

        <TextField
          label="Reason (optional)"
          value={reason}
          onChange={event => setReason(event.currentTarget.value)}
          disabled={currentEnabled}
        />

        <Stack direction="row" gap={1}>
          <Button variant="contained" onClick={() => void handleEnable()} disabled={enabling || currentEnabled}>
            Enable emergency shutdown
          </Button>
          <Button variant="outlined" onClick={() => void handleDisable()} disabled={disabling || !currentEnabled}>
            Disable
          </Button>
          <Button variant="outlined" onClick={() => void refetch()} disabled={isFetching}>
            Refresh status
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
