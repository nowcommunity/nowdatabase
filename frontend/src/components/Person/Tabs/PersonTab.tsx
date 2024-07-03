import { PersonDetailsType } from '@/backendTypes'
import { ArrayFrame } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const PersonTab = () => {
  const { textField, data } = useDetailContext<PersonDetailsType>()

  const person = [
    ['Initials', textField('initials')],
    ['First Name', textField('first_name')],
    ['Surname', textField('surname')],
    ['Email', textField('email')],
    ['Organization', textField('organization')],
    ['Country', textField('country')],
  ]

  const user = data.user
    ? [
        ['User Name', data.user?.user_name ?? ''],
        ['Last log in', data.user?.last_login?.toString()],
        ['User Group', data.user?.now_user_group ?? ''],
      ]
    : [['Not a user']]

  return (
    <>
      <ArrayFrame array={person} title="Person" />
      <ArrayFrame array={user} title="User" />
    </>
  )
}
