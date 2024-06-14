import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllPersonsQuery } from '../../redux/personReducer'
import { Person } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const PersonTable = ({ selectorFn }: { selectorFn?: (id: Person) => void }) => {
  const personQuery = useGetAllPersonsQuery()
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        id: 'id',
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
    ],
    []
  )
  const checkRowRestriction = () => {
    return false
  }

  return (
    <TableView<Person>
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="initials"
      columns={columns}
      data={personQuery.data}
      url="person"
    />
  )
}
