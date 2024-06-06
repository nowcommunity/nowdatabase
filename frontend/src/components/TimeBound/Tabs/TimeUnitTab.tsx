import { TimeUnit, TimeBoundDetailsType } from '@/backendTypes'
import { useGetTimeBoundTimeUnitsQuery } from '@/redux/timeBoundReducer'
import { CircularProgress } from '@mui/material'
import { TableView } from '../../TableView/TableView'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const TimeUnitTab = () => {
  const { data } = useDetailContext<TimeBoundDetailsType>()
  const { data: timeUnitsData, isError } = useGetTimeBoundTimeUnitsQuery(data.bid!)

  if (isError) return 'Error loading Time Units.'
  if (!timeUnitsData) return <CircularProgress />

  const columns = [
    {
      accessorKey: 'tu_name',
      header: 'ID',
    },
    {
      accessorKey: 'tu_display_name',
      header: 'Name',
    },
    {
      accessorKey: 'up_bnd',
      // accessorFn: ({ up_bnd }) => up_bnd === data.bid,
      header: 'Upper Bound',
    },
    {
      accessorKey: 'low_bnd',
      // accessorFn: ({ low_bnd }) => low_bnd === data.bid,
      header: 'Lower Bound',
    },
    {
      accessorKey: 'rank',
      header: 'Rank',
    },
    {
      accessorKey: 'sequence',
      header: 'Sequence',
    },
    {
      accessorKey: 'tu_comment',
      header: 'Comment',
    },
  ]
  const checkRowRestriction = () => {
    return false
  }

  return (
    <TableView<TimeUnit>
      checkRowRestriction={checkRowRestriction}
      idFieldName="tu_name"
      columns={columns}
      data={timeUnitsData}
      url="time-unit"
    />
  )
}
