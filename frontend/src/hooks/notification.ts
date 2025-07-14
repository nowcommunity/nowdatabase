import { NotificationContext } from '@/components/Notification'
import { useContext } from 'react'

export const useNotify = () => {
  const { notify, setMessage } = useContext(NotificationContext)
  // setMessage can be used to change a notification's message without creating a new one
  // use this to create a progress bar etc.
  return { notify, setMessage }
}
