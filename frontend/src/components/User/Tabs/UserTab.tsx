import { UserDetailsType } from '@/backendTypes'
import { ArrayFrame } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const UserTab = () => {
  const { textField } = useDetailContext<UserDetailsType>()

  const user = [
    ['User Name', textField('user_name')],
    ['Password', textField('password')],
    ['Confirm Password', textField('password')],
    ['Last log in', textField('last_login')],
    ['User Group', textField('now_user_group')],
  ]

  return (
    <>
      <ArrayFrame array={user} title="User" />
    </>
  )
}
