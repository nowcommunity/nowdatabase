import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllTimeUnitsQuery } from '../../redux/timeUnitReducer'
import { TimeUnit } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const TimeUnitTable = ({ selectorFn }: { selectorFn?: (newTimeUnit: TimeUnit) => void }) => {
  const time_unitQuery = useGetAllTimeUnitsQuery()
  const columns = useMemo<MRT_ColumnDef<TimeUnit>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'tu_name',
        header: 'Time Unit Id',
        size: 20,
      },
      {
        accessorKey: 'tu_display_name',
        header: 'Time Unit',
      },
      {
        accessorKey: 'low_bound',
        header: 'Lower Bound',
      },
      {
        accessorKey: 'up_bound',
        header: 'Upper Bound',
      },
      {
        accessorKey: 'seq_name',
        header: 'Sequence',
      },
      {
        accessorKey: 'rank',
        header: 'Rank',
      },
    ],
    []
  )
  const checkRowRestriction = () => {
    return false
  }

  return (
    <TableView<TimeUnit>
      title="Time units"
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="tu_name"
      columns={columns}
      data={time_unitQuery.data}
      url="time-unit"
    />
  )
}
