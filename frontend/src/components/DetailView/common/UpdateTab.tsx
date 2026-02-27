import { AnyReference, UpdateLog } from '@/shared/types'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { SimpleTable } from '@/components/DetailView/common/SimpleTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { Box, Card, Divider } from '@mui/material'
import { MRT_ColumnDef, MRT_Row, MRT_RowData } from 'material-react-table'
import { ReferenceList } from './ReferenceList'

const formatDate = (date: Date | null) => {
  if (!date) return 'No date'
  return new Date(date).toISOString().split('T')[0]
}

export const UpdateTab = <T, UpdateType extends MRT_RowData & { updates: UpdateLog[] }>({
  prefix,
  refFieldName,
  updatesFieldName,
  placeholderMessage,
}: {
  prefix: string
  refFieldName?: keyof UpdateType
  updatesFieldName?: keyof T
  placeholderMessage?: string
}) => {
  const { data } = useDetailContext<T>()

  if (placeholderMessage) {
    return (
      <Grouped title="Updates">
        <Box>{placeholderMessage}</Box>
      </Grouped>
    )
  }

  if (!refFieldName || !updatesFieldName) return null

  const columns: MRT_ColumnDef<UpdateType>[] = [
    {
      accessorKey: `${prefix}_date`,
      header: 'Date',
      Cell: ({ cell }) => formatDate(cell.getValue() as Date | null),
    },
    {
      accessorKey: `${prefix}_authorizer`,
      header: 'Editor',
    },
    {
      accessorKey: `${prefix}_coordinator`,
      header: 'Coordinator',
    },
    {
      accessorKey: refFieldName as string,
      header: 'Reference',
      Cell: ({ row }: { row: MRT_Row<UpdateType> }) => (
        <ReferenceList references={row.original[refFieldName]} big={false} />
      ),
    },
    {
      header: 'Details',
      Cell: ({ row }: { row: MRT_Row<UpdateType> }) => (
        <DetailsModal
          date={row.original[`${prefix}_date`] as Date}
          authorizer={row.original[`${prefix}_authorizer`] as string}
          coordinator={row.original[`${prefix}_coordinator`] as string}
          updates={row.original.updates}
          comment={row.original[`${prefix}_comment` as keyof UpdateType] as string}
          references={row.original[refFieldName]}
        />
      ),
    },
  ]

  return (
    <Grouped title="Updates">
      <SimpleTable columns={columns} data={data[updatesFieldName] as UpdateType[]} />
    </Grouped>
  )
}

const DetailsModal = ({
  updates,
  references,
  comment,
  date,
  authorizer,
  coordinator,
}: {
  updates: UpdateLog[]
  references: AnyReference[]
  comment: string
  date: Date
  authorizer: string
  coordinator: string
}) => {
  const columns: MRT_ColumnDef<UpdateLog>[] = [
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

  return (
    <EditingModal buttonText="Details" dataCy="update-details-button">
      <h3>Update log</h3>
      <Card
        sx={{ padding: '0.4em', margin: '0.5em', paddingLeft: '1em', maxWidth: '30em', backgroundColor: 'lightblue' }}
      >
        <Box>
          <p>
            <b>Date:</b> {formatDate(date)}
          </p>
          <p>
            <b>Editor:</b> {authorizer}
          </p>
          <p>
            <b>Coordinator:</b> {coordinator}
          </p>
          <p>
            <b>Comment:</b> {comment ?? ''}
          </p>
        </Box>
      </Card>
      <Divider />
      <h3>References</h3>
      {references.length === 0 ? <Box>Update has no references.</Box> : <ReferenceList references={references} big />}
      <Divider />
      <h3>Changed database values</h3>
      <SimpleTable columns={columns} data={updates} />
    </EditingModal>
  )
}
