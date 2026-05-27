import { Box, Card, Divider, Stack, Typography } from '@mui/material'
import { MRT_ColumnDef, MRT_Row } from 'material-react-table'
import { AnyReference, TimeBoundUpdate, TimeUnitUpdate, TimeUnitUpdateSummary, UpdateLog } from '@/shared/types'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { ReferenceList } from '@/components/DetailView/common/ReferenceList'
import { SimpleTable } from '@/components/DetailView/common/SimpleTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'

const formatDate = (date: Date | string | null) => {
  if (!date) return 'No date'
  return new Date(date).toISOString().split('T')[0]
}

const getReferences = (update: TimeUnitUpdateSummary): AnyReference[] => [
  ...(update.now_tau?.now_tr ?? []),
  ...(update.lower_bound_update?.now_br ?? []),
  ...(update.upper_bound_update?.now_br ?? []),
]

const getLinkedUpdateLabels = (update: TimeUnitUpdateSummary) => {
  const labels: string[] = []
  if (update.now_tau) labels.push('Time unit')
  if (update.lower_bound_update) labels.push('Lower bound')
  if (update.upper_bound_update) labels.push('Upper bound')
  return labels.join(', ') || 'No linked update rows'
}

export const TimeUnitUpdateTab = () => {
  const { data } = useDetailContext<{ now_time_update: TimeUnitUpdateSummary[] }>()
  const updates = data.now_time_update

  if (!Array.isArray(updates)) {
    return (
      <Grouped title="Updates">
        <Box>No updates available.</Box>
      </Grouped>
    )
  }

  const columns: MRT_ColumnDef<TimeUnitUpdateSummary>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      Cell: ({ cell }) => formatDate(cell.getValue() as Date | string | null),
    },
    {
      accessorKey: 'authorizer',
      header: 'Editor',
    },
    {
      accessorKey: 'coordinator',
      header: 'Coordinator',
    },
    {
      header: 'Linked updates',
      accessorFn: getLinkedUpdateLabels,
    },
    {
      header: 'References',
      Cell: ({ row }: { row: MRT_Row<TimeUnitUpdateSummary> }) => (
        <ReferenceList references={getReferences(row.original)} big={false} />
      ),
    },
    {
      header: 'Details',
      Cell: ({ row }: { row: MRT_Row<TimeUnitUpdateSummary> }) => <DetailsModal update={row.original} />,
    },
  ]

  return (
    <Grouped title="Updates">
      <SimpleTable columns={columns} data={updates} />
    </Grouped>
  )
}

const DetailsModal = ({ update }: { update: TimeUnitUpdateSummary }) => {
  const references = getReferences(update)

  return (
    <EditingModal buttonText="Details" dataCy="update-details-button">
      <h3>Update log</h3>
      <Card
        sx={{ padding: '0.4em', margin: '0.5em', paddingLeft: '1em', maxWidth: '30em', backgroundColor: 'lightblue' }}
      >
        <Box>
          <p>
            <b>Date:</b> {formatDate(update.date)}
          </p>
          <p>
            <b>Editor:</b> {update.authorizer}
          </p>
          <p>
            <b>Coordinator:</b> {update.coordinator}
          </p>
          <p>
            <b>Comment:</b> {update.comment ?? ''}
          </p>
        </Box>
      </Card>
      <Divider />
      <h3>References</h3>
      {references.length === 0 ? <Box>Update has no references.</Box> : <ReferenceList references={references} big />}
      <Divider />
      <h3>Changed database values</h3>
      <Stack spacing={2}>
        <TimeUnitUpdateSection title="Time unit" update={update.now_tau} />
        <TimeBoundUpdateSection title="Lower bound" update={update.lower_bound_update} />
        <TimeBoundUpdateSection title="Upper bound" update={update.upper_bound_update} />
      </Stack>
    </EditingModal>
  )
}

const logColumns: MRT_ColumnDef<UpdateLog>[] = [
  {
    header: 'Table',
    accessorKey: 'table_name',
  },
  {
    header: 'Field',
    accessorKey: 'column_name',
  },
  {
    header: 'Action',
    accessorFn: ({ log_action }) => (log_action === 1 ? 'Delete' : log_action === 3 ? 'Update' : 'Add'),
  },
  {
    header: 'Old data',
    accessorKey: 'old_data',
  },
  {
    header: 'New data',
    accessorKey: 'new_data',
  },
]

const ChangeLogTable = ({ updates }: { updates: UpdateLog[] }) =>
  updates.length === 0 ? (
    <Box>No changed database values found for this linked update.</Box>
  ) : (
    <SimpleTable columns={logColumns} data={updates} />
  )

const TimeUnitUpdateSection = ({ title, update }: { title: string; update: TimeUnitUpdate | null }) => {
  if (!update) return null

  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2">
        {formatDate(update.tau_date)} / {update.tau_authorizer} / {update.tau_comment ?? ''}
      </Typography>
      <ChangeLogTable updates={update.updates} />
    </Box>
  )
}

const TimeBoundUpdateSection = ({ title, update }: { title: string; update: TimeBoundUpdate | null }) => {
  if (!update) return null

  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2">
        {formatDate(update.bau_date)} / {update.bau_authorizer} / {update.bau_comment ?? ''}
      </Typography>
      <ChangeLogTable updates={update.updates} />
    </Box>
  )
}
