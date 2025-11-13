import { useMemo } from 'react'
import { PermissionDenied } from '@/components/PermissionDenied'
import { PersonTable } from '@/components/Person/PersonTable'
import { resolveErrorStatus } from '@/components/TableView/errorUtils'
import { useGetAllPersonsQuery } from '@/redux/personReducer'

export const PersonListPage = () => {
  const { isError, error } = useGetAllPersonsQuery()

  const isForbidden = useMemo(() => {
    if (!isError) return false
    const status = resolveErrorStatus(error)
    return status === 403
  }, [error, isError])

  if (isForbidden) {
    return (
      <PermissionDenied
        title="You do not have access to the people table"
        message="Your account is not allowed to browse the people directory. Please contact an administrator if you believe this is a mistake."
      />
    )
  }

  return <PersonTable />
}

export default PersonListPage
