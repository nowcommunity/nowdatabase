import { PersonDetailsType } from '@/backendTypes'
import { ArrayFrame, Grouped } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { formatLastLoginDate } from '@/common'
import { useUser } from '@/hooks/user'
import { Box, TextField } from '@mui/material'
import { PasswordForm } from './PasswordForm'

export const PersonTab = () => {
  const { textField, data } = useDetailContext<PersonDetailsType>()
  const currentUser = useUser()

  const person = [
    ['Initials', textField('initials')],
    ['First Name', textField('first_name')],
    ['Surname', textField('surname')],
    ['Email', textField('email')],
    ['Organization', textField('organization')],
    ['Country', textField('country')],
  ]
  const lastLogin = data.user?.last_login

  const user = data.user
    ? [
        ['User Name', data.user?.user_name ?? ''],
        ['Last log in', lastLogin ? formatLastLoginDate(lastLogin) : 'No data'],
        ['User Group', data.user?.now_user_group ?? ''],
      ]
    : [['Not a user']]

  return (
    <>
      <ArrayFrame array={person} title="Person" />
      <ArrayFrame array={user} title="User" />
      {currentUser.initials === data.initials && (
        <Grouped title="Change password">
          <PasswordForm />
        </Grouped>
      )}
    </>
  )
}
