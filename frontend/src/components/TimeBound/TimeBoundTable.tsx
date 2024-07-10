import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllTimeBoundsQuery } from '../../redux/timeBoundReducer'
import { TimeBound } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const TimeBoundTable = ({ selectorFn }: { selectorFn?: (newTimeBound: TimeBound) => void }) => {
  const time_boundQuery = useGetAllTimeBoundsQuery()
  const columns = useMemo<MRT_ColumnDef<TimeBound>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'bid',
        header: 'Time Bound Id',
        size: 20,
      },
      {
        accessorKey: 'b_name',
        header: 'Name',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'b_comment',
        header: 'Comment',
      },
    ],
    []
  )
  const checkRowRestriction = () => {
    return false
  }

  return (
    <TableView<TimeBound>
      title="Time bounds"
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="bid"
      columns={columns}
      data={time_boundQuery.data}
      url="time-bound"
    />
  )
}
