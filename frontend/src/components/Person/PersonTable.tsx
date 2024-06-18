import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllPersonsQuery } from '../../redux/personReducer'
import { PersonDetailsType } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const PersonTable = ({ selectorFn }: { selectorFn?: (id: PersonDetailsType) => void }) => {
  const personQuery = useGetAllPersonsQuery()
  const columns = useMemo<MRT_ColumnDef<PersonDetailsType>[]>(
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
    <TableView<PersonDetailsType>
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="initials"
      columns={columns}
      data={personQuery.data}
      url="person"
    />
  )
}
