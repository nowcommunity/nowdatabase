import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllTimeBoundsQuery } from '../../redux/timeBoundReducer'
import { TimeBound } from '@/shared/types'
import { TableView } from '../TableView/TableView'

export const TimeBoundTable = ({
  selectorFn,
  showBid = false,
}: {
  selectorFn?: (newTimeBound: TimeBound) => void
  showBid?: boolean
}) => {
  const { data: timeBoundQueryData, isFetching } = useGetAllTimeBoundsQuery()
  const columns = useMemo<MRT_ColumnDef<TimeBound>[]>(
    () => [
      {
        accessorKey: 'bid',
        header: 'Time Bound Id',
        size: 20,
        enableColumnFilterModes: false,
      },
      {
        id: 'b_name',
        accessorFn: row => row.b_name || '',
        header: 'Name',
        enableHiding: false,
        filterFn: 'contains',
      },
      {
        accessorKey: 'age',
        header: 'Age',
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        id: 'b_comment',
        accessorFn: row => row.b_comment || '',
        header: 'Comment',
        filterFn: 'contains',
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
      isFetching={isFetching}
      visibleColumns={visibleColumns}
      data={timeBoundQueryData}
      url="time-bound"
      enableColumnFilterModes={true}
    />
  )
}
