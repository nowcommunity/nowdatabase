import { UserDetailsType } from '../../../frontend/src/shared/types'
import { nowDb } from './db'
import { validatePassword } from './validatePassword'

const isUsernameTaken = async (username: string): Promise<boolean> =>
  !!(await nowDb.com_users.findFirst({ where: { user_name: username } }))

const personWithoutUserExists = async (initials: string): Promise<boolean> => {
  const person = await nowDb.com_people.findFirst({ where: { initials: initials } })
  if (!person) return false
  if (person.user_id) {
    const user = await nowDb.com_users.findFirst({ where: { user_id: person.user_id } })
    if (user) return false
  }
  return true
}

export const validateUser = async (user: UserDetailsType): Promise<string | null> => {
  const usernameMinLength = 3
  const usernameMaxLength = 100

  if (!user.user_name) return 'Username is missing.'
  if (!user.password) return 'Password is missing.'
  if (!user.now_user_group) return 'User group is missing.'

  if (user.user_name?.length < usernameMinLength || user.user_name?.length > usernameMaxLength)
    return `Username must be between ${usernameMinLength} and ${usernameMaxLength} characters.`

  const res = validatePassword(user.password)
  if (!res.isValid) return res.error ?? 'Password is invalid.'

  if (await isUsernameTaken(user.user_name)) return 'Username is already in use.'
  if (!(await personWithoutUserExists(user.initials))) return "Person doesn't exist or person already has a user."

  return null
}
