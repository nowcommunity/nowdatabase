import { UserDetailsType, UserGroup } from '../../../../frontend/src/shared/types'
import { createPasswordHash } from '../../utils/createPasswordHash'
import { nowDb } from '../../utils/db'

export const writeUserGroup = async (user_id: number, group: UserGroup) => {
  await nowDb.com_users.update({
    where: { user_id: user_id },
    data: { now_user_group: group.split(' ')[0] },
  })
}

export const writeUser = async (user: UserDetailsType) => {
  const passwordHash = await createPasswordHash(user.password!)
  const createdUser = await nowDb.com_users.create({
    data: {
      user_name: user.user_name,
      newpassword: passwordHash,
      now_user_group: user.now_user_group?.split(' ')[0],
    },
  })

  if (!createdUser || !createdUser.user_id) throw Error('Could not create user.')

  const createdPerson = await nowDb.com_people.update({
    where: { initials: user.initials },
    data: { user_id: createdUser.user_id },
  })

  if (!createdPerson) throw Error("Could not update person's user ID.")
}
