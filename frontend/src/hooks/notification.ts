import { NotificationContext } from '@/components/Notification'
import { useContext } from 'react'

export const useNotify = () => {
  const { notify } = useContext(NotificationContext)
  return notify
}
