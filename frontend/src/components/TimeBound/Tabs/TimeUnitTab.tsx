import { TimeUnit, TimeBoundDetailsType } from '@/backendTypes'
import { useGetTimeBoundTimeUnitsQuery } from '@/redux/timeBoundReducer'
import { CircularProgress } from '@mui/material'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { MRT_ColumnDef } from 'material-react-table'
import { SimpleTable } from '@/components/DetailView/common/SimpleTable'

export const TimeUnitTab = () => {
  const { data } = useDetailContext<TimeBoundDetailsType>()
  const { data: timeUnitsData, isError } = useGetTimeBoundTimeUnitsQuery(data.bid)

  if (isError) return 'Error loading Time Units.'
  if (!timeUnitsData) return <CircularProgress />

  const columns: MRT_ColumnDef<TimeUnit>[] = [
    {
      accessorKey: 'tu_name',
      header: 'ID',
    },
    {
      accessorKey: 'tu_display_name',
      header: 'Name',
    },
    {
      accessorFn: ({ up_bound }) => (up_bound === data.bid ? 'Upper' : 'Lower'),
      header: 'Upper/Lower',
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

  return <SimpleTable<TimeUnit> columns={columns} data={timeUnitsData} />
}
