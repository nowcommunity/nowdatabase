import { Alert, Snackbar } from '@mui/material'
import { createContext, ReactNode, useContext, useState } from 'react'

export type Severity = 'success' | 'info' | 'warning' | 'error'

export type NotificationContext = {
  notify: (msg: string, severity?: Severity) => void
  open: boolean
  setOpen: (open: boolean) => void
  message: string
  severity?: Severity
}

// this wasn't spotted earlier due to a (now fixed) bug in the eslint react-refresh plugin
// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<NotificationContext>(null!)

export const NotificationContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<Severity | undefined>(undefined)
  const notify = (message: string, severity?: Severity) => {
    setOpen(false)
    /* If we don't first close the old one, the autoHideDuration timer will not reset
    causing the new notification to show too short time. */
    setTimeout(() => {
      setOpen(true)
      setMessage(message)
      setSeverity(severity)
    }, 200)
  }
  return (
    <NotificationContext.Provider value={{ open, setOpen, message, severity, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const Notification = () => {
  const { open, setOpen, message, severity } = useContext(NotificationContext)
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%', fontSize: 16 }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}
