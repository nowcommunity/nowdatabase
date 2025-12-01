import { useMemo } from 'react'
import { useGetAllPersonsQuery } from '@/redux/personReducer'
import type { PersonDetailsType } from '@/shared/types'

export type UserOption = {
  userId: number
  label: string
  initials: string
}

type PersonWithUserId = PersonDetailsType & { user: NonNullable<PersonDetailsType['user']> & { user_id: number } }

const hasUserId = (person: PersonDetailsType): person is PersonWithUserId => typeof person.user?.user_id === 'number'

const formatUserLabel = ({
  surname,
  first_name,
  user,
}: {
  surname: string | null
  first_name: string | null
  user?: { user_name: string | null }
}) => {
  if (surname) {
    return `${surname}${first_name ? `, ${first_name}` : ''}`
  }

  if (user?.user_name) return user.user_name

  return 'Unknown user'
}

export const useUsersApi = () => {
  const personsQuery = useGetAllPersonsQuery()

  const users: UserOption[] = useMemo(() => {
    const personsWithUserIds: PersonWithUserId[] = (personsQuery.data ?? []).filter(hasUserId)

    return personsWithUserIds
      .map(person => ({
        userId: person.user.user_id,
        label: formatUserLabel({ surname: person.surname, first_name: person.first_name, user: person.user }),
        initials: person.initials,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [personsQuery.data])

  return { ...personsQuery, users }
}

export default useUsersApi
