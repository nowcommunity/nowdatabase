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
        accessorKey: 'tu_name',
        header: 'Time Unit Id',
        size: 20,
      },
      {
        accessorKey: 'tu_display_name',
        header: 'Time Unit',
        enableHiding: false,
        filterFn: 'contains',
      },
      {
        accessorKey: 'low_bound',
        header: 'Lower Bound',
        filterVariant: 'range',
      },
      {
        accessorKey: 'up_bound',
        header: 'Upper Bound',
        filterVariant: 'range',
      },
      {
        accessorKey: 'seq_name',
        header: 'Sequence',
        filterFn: 'contains',
      },
      {
        accessorKey: 'rank',
        header: 'Rank',
      },
    ],
    []
  )

  const visibleColumns = {
    tu_name: false,
  }

  return (
    <TableView<TimeUnit>
      title="Time units"
      selectorFn={selectorFn}
      idFieldName="tu_name"
      columns={columns}
      visibleColumns={visibleColumns}
      data={time_unitQuery.data}
      url="time-unit"
    />
  )
}
