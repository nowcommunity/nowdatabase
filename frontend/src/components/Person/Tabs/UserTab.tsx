import { PersonDetailsType } from '@/backendTypes'
import { ArrayFrame } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const UserTab = () => {
  const { data } = useDetailContext<PersonDetailsType>()

  const user = [
    ['User Name', data.user!.user_name ?? ''],
    ['Last log in', data.user!.last_login?.toString()],
    ['User Group', data.user!.now_user_group ?? ''],
  ]

  return (
    <>
      <ArrayFrame array={user} title="User" />
    </>
  )
}
