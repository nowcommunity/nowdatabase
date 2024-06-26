import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllUsersQuery } from '../../redux/userReducer'
import { PersonDetailsType } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const UserTable = ({ selectorFn }: { selectorFn?: (person: PersonDetailsType) => void }) => {
  const userQuery = useGetAllUsersQuery()
  const columns = useMemo<MRT_ColumnDef<PersonDetailsType>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'User_id',
        header: 'Id',
        size: 20,
      },
      {
        accessorKey: 'user_name',
        header: 'User name',
      },
      {
        accessorKey: 'last_login',
        header: 'Last login',
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
      data={userQuery.data}
      url="user"
    />
  )
}
