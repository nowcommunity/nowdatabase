import { useParams, useNavigate } from 'react-router-dom'
import { useEditPersonMutation, useGetPersonDetailsQuery } from '../../redux/personReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { PersonTab } from './Tabs/PersonTab'
import { useUser } from '@/hooks/user'
import { EditDataType, PersonDetailsType, Role, ValidationErrors } from '@/shared/types'
import { validatePerson } from '@/shared/validators/person'
import { useNotify } from '@/hooks/notification'
import { useEffect } from 'react'

export const PersonDetails = () => {
  const { id: idFromUrl } = useParams()
  const user = useUser()
  const [editPersonRequest, { isLoading: mutationLoading }] = useEditPersonMutation()
  const notify = useNotify()
  const navigate = useNavigate()

  // A bit convoluted, but this is to allow using the same component for user's own page
  // while omitting some detailview buttons like 'return to table' and browsing.
  // We designate special id 'user-page' instead of normal initials to mean current user's own page.
  const isUserPage = idFromUrl === 'user-page'
  const id = isUserPage ? user.initials : idFromUrl

  const { isLoading, isError, data } = useGetPersonDetailsQuery(id!)

  useEffect(() => {
    if (!isUserPage && user.role !== Role.Admin) {
      // if user has navigated to any person details page through the url, they are redirected to user-page instead
      navigate('/person/user-page')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onWrite = async (editData: EditDataType<PersonDetailsType>) => {
    try {
      const { initials } = await editPersonRequest(editData).unwrap()
      notify('Saved person successfully.')
      if (isUserPage) {
        setTimeout(() => navigate('/person/user-page'), 15)
      } else {
        setTimeout(() => navigate(`/person/${initials}`), 15)
      }
    } catch (e) {
      const error = e as ValidationErrors
      notify('Following validators failed: ' + error.data.map(e => e.name).join(', '), 'error')
    }
  }

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data || mutationLoading) return <CircularProgress />

  document.title = `User - ${data.user?.user_name}`

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
      validator={validatePerson}
    />
  )
}
