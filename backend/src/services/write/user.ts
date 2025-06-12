import { nowDb } from '../../utils/db'

export const validUserGroups = ['su', 'eu', 'er', 'pl', 'plp', 'no', 'ro']
export type UserGroup = 'su' | 'eu' | 'er' | 'pl' | 'plp' | 'no' | 'ro'

export const writeUserGroup = async (user_id: number, group: UserGroup) => {
  await nowDb.com_users.update({
    where: { user_id: user_id },
    data: { now_user_group: group },
  })
}
