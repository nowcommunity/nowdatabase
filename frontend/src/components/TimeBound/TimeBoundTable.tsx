import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllTimeBoundsQuery } from '../../redux/timeBoundReducer'
import { TimeBound } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const TimeBoundTable = ({
  selectorFn,
  showBid = false,
}: {
  selectorFn?: (newTimeBound: TimeBound) => void
  showBid?: boolean
}) => {
  const time_boundQuery = useGetAllTimeBoundsQuery()
  const columns = useMemo<MRT_ColumnDef<TimeBound>[]>(
    () => [
      {
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
        filterVariant: 'range',
      },
      {
        accessorKey: 'b_comment',
        header: 'Comment',
      },
    ],
    []
  )

  const visibleColumns = {
    bid: showBid,
  }

  return (
    <TableView<TimeBound>
      title="Time bounds"
      selectorFn={selectorFn}
      idFieldName="bid"
      columns={columns}
      visibleColumns={visibleColumns}
      data={time_boundQuery.data}
      url="time-bound"
    />
  )
}
