import { EditRights } from './Page'
import { UserState } from '@/redux/userReducer'

export const noRights: EditRights = {}
export const fullRights: EditRights = { new: true, edit: true, delete: true }
export const limitedRights: EditRights = { new: true, edit: true }
export const userHasLocalityAccess = (user: UserState, id: string | number) => {
  const parsedId = typeof id === 'number' ? id : parseInt(id, 10)
  if (!Number.isFinite(parsedId)) return false
  return user.localities.includes(parsedId)
}
