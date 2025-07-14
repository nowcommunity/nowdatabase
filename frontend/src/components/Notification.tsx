import { Alert, Snackbar } from '@mui/material'
import { createContext, ReactNode, useContext, useState } from 'react'

export type Severity = 'success' | 'info' | 'warning' | 'error'

export type NotificationContext = {
  notify: (msg: string, severity?: Severity, timeoutValue?: number | null) => void
  open: boolean
  setOpen: (open: boolean) => void
  message: string
  setMessage: (message: string) => void
  severity?: Severity
  timeoutValue?: number | null
}

// this wasn't spotted earlier due to a (now fixed) bug in the eslint react-refresh plugin
// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<NotificationContext>(null!)

export const NotificationContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<Severity | undefined>(undefined)
  /* If not set, defaults to 6000 in the Notification component.
  Setting timeoutValue to null makes the notification stay on screen until the user dismisses it. */
  const [timeoutValue, setTimeoutValue] = useState<number | null | undefined>(undefined)

  const notify = (message: string, severity?: Severity, timeoutValue?: number | null) => {
    setOpen(false)
    /* If we don't close the old one first, the autoHideDuration timer will not reset
    causing the new notification to close too quickly. */
    setTimeout(() => {
      setOpen(true)
      setMessage(message)
      setSeverity(severity)
      setTimeoutValue(timeoutValue)
    }, 200)
  }
  return (
    <NotificationContext.Provider value={{ open, setOpen, message, setMessage, severity, timeoutValue, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const Notification = () => {
  const { open, setOpen, message, severity, timeoutValue } = useContext(NotificationContext)
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
        autoHideDuration={timeoutValue === undefined ? 6000 : timeoutValue}
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
