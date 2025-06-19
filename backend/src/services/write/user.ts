import { nowDb } from '../../utils/db'

export const validUserGroups = ['su (admin)', 'eu (edit unrestricted)', 'er (edit restricted)', 'ro (read only)']
export type UserGroup = 'su (admin)' | 'eu (edit unrestricted)' | 'er (edit restricted)' | 'ro (read only)'
export const writeUserGroup = async (user_id: number, group: UserGroup) => {
  await nowDb.com_users.update({
    where: { user_id: user_id },
    data: { now_user_group: group.substring(0, 2) },
  })
}
