import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllPersonsQuery } from '../../redux/personReducer'
import { PersonDetailsType } from '@/backendTypes'
import { TableView } from '../TableView/TableView'
import { formatLastLoginDate } from '@/common'

export const PersonTable = ({ selectorFn }: { selectorFn?: (id: PersonDetailsType) => void }) => {
  const personQuery = useGetAllPersonsQuery()
  const columns = useMemo<MRT_ColumnDef<PersonDetailsType>[]>(
    () => [
      {
        accessorKey: 'initials',
        header: 'Person Id',
      },
      {
        accessorKey: 'first_name',
        header: 'First name',
      },
      {
        accessorKey: 'surname',
        header: 'Surname',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'organization',
        header: 'Organisation',
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
      {
        id: 'user_id',
        accessorKey: 'user.user_id',
        header: 'User Id',
        size: 20,
      },
      {
        accessorKey: 'user.user_name',
        header: 'User name',
      },
      {
        accessorFn: (person: PersonDetailsType) =>
          person.user?.last_login ? formatLastLoginDate(person.user?.last_login) : 'None',
        header: 'Last login',
      },
      {
        accessorKey: 'initials',
        header: 'Initials',
      },

      {
        accessorKey: 'user.now_user_group',
        header: 'User role',
      },
    ],
    []
  )

  const visibleColumns = {
    iniitals: false,
  }

  return (
    <TableView<PersonDetailsType>
      title="People"
      selectorFn={selectorFn}
      idFieldName="initials"
      columns={columns}
      visibleColumns={visibleColumns}
      data={personQuery.data}
      url="person"
    />
  )
}
