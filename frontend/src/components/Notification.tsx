import { Alert, Snackbar } from '@mui/material'
import { createContext } from 'react'

export type Severity = 'success' | 'info' | 'warning' | 'error'

export type NotificationContext = {
  notify: (msg: string, severity?: Severity) => void
}

export const NotificationContext = createContext<NotificationContext>(null!)

export const Notification = ({
  open,
  setOpen,
  message,
  severity = 'success',
}: {
  open: boolean
  setOpen: (open: boolean) => void
  message: string
  severity?: Severity
}) => {
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <div>
      <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%', fontSize: 16 }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}
