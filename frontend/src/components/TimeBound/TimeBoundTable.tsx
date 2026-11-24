import { TimeBound } from '@/shared/types'
import { type MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { useGetAllTimeBoundsQuery } from '../../redux/timeBoundReducer'
import { TableView } from '../TableView/TableView'

import { CircularProgress } from '@mui/material'

export const TimeBoundTable = ({
  selectorFn,
  navigateOnRowClick = true,
  showBid = false,
}: {
  selectorFn?: (newTimeBound: TimeBound) => void
  navigateOnRowClick?: boolean
  showBid?: boolean
}) => {
  const { data: timeBoundQueryData, isFetching, isError, error } = useGetAllTimeBoundsQuery()

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

  if (!timeBoundQueryData) return <CircularProgress />

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
      isError={isError}
      error={error}
      visibleColumns={visibleColumns}
      data={timeBoundQueryData}
      url="time-bound"
      enableColumnFilterModes={true}
      navigateOnRowClick={navigateOnRowClick}
    />
  )
}
