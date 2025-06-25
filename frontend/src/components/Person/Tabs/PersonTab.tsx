import { PersonDetailsType } from '@/shared/types'
import { ArrayFrame, Grouped } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { formatLastLoginDate } from '@/common'
import { useUser } from '@/hooks/user'
import { ChangePasswordForm } from './ChangePasswordForm'
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useNotify } from '@/hooks/notification'
import { validCountries } from '@/shared/validators/countryList'
import { useParams } from 'react-router-dom'

export const PersonTab = () => {
  const { textField, dropdownWithSearch, data } = useDetailContext<PersonDetailsType>()
  const currentUser = useUser()
  const notify = useNotify()
  const { id: idFromUrl } = useParams()
  const isNew = idFromUrl === 'new'

  useEffect(() => {
    if (!currentUser?.isFirstLogin) return
    window.scrollTo(0, document.body.scrollHeight)
    notify('First login detected. Please change your password!', 'warning', null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  const countryOptions = ['', ...validCountries]
  const userGroupOptions = ['su', 'eu', 'er', 'pl', 'plp', 'no', 'ro']

  const person = [
    ['Initials', textField('initials', { type: 'text', disabled: !isNew })],
    ['First Name', textField('first_name')],
    ['Surname', textField('surname')],
    ['Email', textField('email')],
    ['Organization', textField('organization')],
    ['Country', dropdownWithSearch('country', countryOptions, 'Country')],
  ]
  const lastLogin = data.user?.last_login

  const user = data.user
    ? [
        ['User Name', data.user?.user_name ?? ''],
        ['Last log in', lastLogin ? formatLastLoginDate(lastLogin) : 'No data'],
        [
          'User Group',
          dropdownWithSearch('now_user_group', userGroupOptions, 'User Group', false, 'Choose user group'),
        ],
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
