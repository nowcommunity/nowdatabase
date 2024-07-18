import { PersonDetailsType } from '@/backendTypes'
import { ArrayFrame, Grouped } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { formatLastLoginDate } from '@/common'
import { useUser } from '@/hooks/user'
import { ChangePasswordForm } from './ChangePasswordForm'
import { Box } from '@mui/material'
import { useEffect } from 'react'

export const PersonTab = () => {
  const { textField, data } = useDetailContext<PersonDetailsType>()
  const currentUser = useUser()

  useEffect(() => {
    if (!currentUser) return
    window.scrollTo(0, document.body.scrollHeight)
  }, [currentUser])

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
        <Grouped title="Change password" style={{ padding: '1em' }}>
          {currentUser.isFirstLogin && (
            <Box sx={{ margin: '0.2em', width: '40em' }}>
              <p style={{ color: 'red', fontWeight: 'bold', fontSize: 26 }}>Please change your password!</p>
              <p style={{ fontSize: 22 }}>
                Changing your password here will only set the password for this new version. The old application will
                still work with your old password.
              </p>
            </Box>
          )}
          <ChangePasswordForm />
        </Grouped>
      )}
    </>
  )
}
