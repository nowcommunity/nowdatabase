import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllTimeUnitsQuery } from '../../redux/timeUnitReducer'
import { TimeUnit } from '@/shared/types'
import { TableView } from '../TableView/TableView'

export const TimeUnitTable = ({
  selectorFn,
  clickableRows = true,
}: {
  selectorFn?: (newTimeUnit: TimeUnit) => void
  clickableRows?: boolean
}) => {
  const { data: timeUnitQueryData, isFetching } = useGetAllTimeUnitsQuery()
  const columns = useMemo<MRT_ColumnDef<TimeUnit>[]>(
    () => [
      {
        accessorKey: 'tu_name',
        header: 'Time Unit Id',
        size: 20,
        enableColumnFilterModes: false,
      },
      {
        id: 'tu_display_name',
        accessorFn: row => row.tu_display_name || '',
        header: 'Time Unit',
        enableHiding: false,
        filterFn: 'contains',
      },
      {
        accessorKey: 'low_bound',
        header: 'Lower Bound',
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        accessorKey: 'up_bound',
        header: 'Upper Bound',
        filterVariant: 'range',
        enableColumnFilterModes: false,
      },
      {
        id: 'seq_name',
        accessorFn: row => row.seq_name || '',
        header: 'Sequence',
        filterFn: 'contains',
      },
      {
        id: 'rank',
        accessorFn: row => row.rank || '',
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
      isFetching={isFetching}
      visibleColumns={visibleColumns}
      clickableRows={clickableRows}
      data={timeUnitQueryData}
      url="time-unit"
      enableColumnFilterModes={true}
    />
  )
}
