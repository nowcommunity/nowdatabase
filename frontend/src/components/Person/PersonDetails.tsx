import { useParams } from 'react-router-dom'
import { useGetPersonDetailsQuery } from '../../redux/personReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { PersonTab } from './Tabs/PersonTab'
import { useUser } from '@/hooks/user'
import { EditDataType, PersonDetailsType } from '@/shared/types'

export const PersonDetails = () => {
  const { id: idFromUrl } = useParams()
  const user = useUser()

  // A bit convoluted, but this is to allow using the same component for user's own page
  // while omitting some detailview buttons like 'return to table' and browsing.
  // We designate special id 'user-page' instead of normal initials to mean current user's own page.
  const isUserPage = idFromUrl === 'user-page'
  const id = isUserPage ? user.initials : idFromUrl

  const { isLoading, isError, data } = useGetPersonDetailsQuery(id!)

  // eslint-disable-next-line @typescript-eslint/require-await
  const onWrite = async (editData: EditDataType<PersonDetailsType>) => {
    // eslint-disable-next-line no-console
    console.log(editData)
  }

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />
  if (data) {
    document.title = `User - ${data.user?.user_name}`
  }

  const tabs: TabType[] = [
    {
      title: 'Person',
      content: <PersonTab />,
    },
  ]

  return (
    <DetailView
      onWrite={onWrite}
      isUserPage={isUserPage}
      isPersonPage={true}
      tabs={tabs}
      data={data}
      validator={() => ({ name: '', error: null })}
    />
  )
}
