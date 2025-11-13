import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export type PermissionDeniedProps = {
  title?: string
  message?: string
  actionHref?: string
  actionLabel?: string
}

const defaultTitle = 'Permission denied'
const defaultMessage = 'You do not have permission to view this content.'
const defaultActionLabel = 'Go back home'

export const PermissionDenied = ({
  title = defaultTitle,
  message = defaultMessage,
  actionHref = '/',
  actionLabel = defaultActionLabel,
}: PermissionDeniedProps) => {
  return (
    <Paper elevation={4} sx={{ maxWidth: 480, margin: 'auto', mt: 6, p: 5 }} role="alert">
      <Stack spacing={3} alignItems="center">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'warning.light',
            color: 'warning.dark',
            borderRadius: '50%',
            height: 72,
            width: 72,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography component="h2" variant="h5">
            {title}
          </Typography>
          <Typography color="text.secondary">{message}</Typography>
        </Stack>
        {actionHref && (
          <Button
            component={RouterLink}
            to={actionHref}
            variant="contained"
            color="warning"
            aria-label="Navigate back to the home page"
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  )
}

export default PermissionDenied
