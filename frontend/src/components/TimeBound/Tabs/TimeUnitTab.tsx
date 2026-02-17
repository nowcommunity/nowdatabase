import { TimeUnit, TimeBoundDetailsType } from '@/shared/types'
import { useGetTimeBoundTimeUnitsQuery } from '@/redux/timeBoundReducer'
import { Alert, Button, CircularProgress, Stack } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { MRT_ColumnDef } from 'material-react-table'
import { DetailTabTable } from '@/components/DetailView/common/DetailTabTable'

export const TimeUnitTab = () => {
  const { data, mode } = useDetailContext<TimeBoundDetailsType>()
  const boundId = typeof data?.bid === 'number' ? data.bid : null
  const queryArg = !mode.new && boundId !== null ? boundId : skipToken

  const { data: timeUnitsData, isError, isLoading, isFetching, refetch } = useGetTimeBoundTimeUnitsQuery(queryArg)

  if (queryArg === skipToken)
    return (
      <Alert data-testid="time-units-disabled" severity="info">
        Save this time bound to view related time units.
      </Alert>
    )

  if (isError)
    return (
      <Stack spacing={2}>
        <Alert data-testid="time-units-error" severity="error">
          Could not load Time Units. Please try again.
        </Alert>
        <Button data-testid="time-units-retry" onClick={() => void refetch()} variant="outlined">
          Retry
        </Button>
      </Stack>
    )

  if (isLoading || isFetching || !timeUnitsData) return <CircularProgress />

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

  return (
    <DetailTabTable<TimeUnit>
      mode="read"
      title="Time Units"
      columns={columns}
      data={timeUnitsData}
      idFieldName="tu_name"
      url="time-unit"
      isFetching={false}
      enableColumnFilterModes={true}
      clickableRows={true}
      paginationPlacement="bottom"
    />
  )
}
