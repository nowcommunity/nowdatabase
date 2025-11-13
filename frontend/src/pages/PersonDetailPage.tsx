import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import { PermissionDenied } from '@/components/PermissionDenied'
import { PersonDetails } from '@/components/Person/PersonDetails'
import { resolveErrorStatus } from '@/components/TableView/errorUtils'
import { useUser } from '@/hooks/user'
import { useGetPersonDetailsQuery } from '@/redux/personReducer'

export const PersonDetailPage = () => {
  const { id: idFromUrl } = useParams()
  const user = useUser()

  const isUserPage = idFromUrl === 'user-page'
  const isNew = idFromUrl === 'new'
  const detailId = isUserPage ? user.initials : idFromUrl

  const queryArg = !detailId || isNew ? skipToken : detailId
  const { isError, error } = useGetPersonDetailsQuery(queryArg)

  const isForbidden = useMemo(() => {
    if (!isError) return false
    const status = resolveErrorStatus(error)
    return status === 403
  }, [error, isError])

  if (isForbidden) {
    return (
      <PermissionDenied
        title="You do not have access to this person"
        message="Your account cannot view the requested person record."
      />
    )
  }

  return <PersonDetails />
}

export default PersonDetailPage
