import { ReferenceDetailsType, UpdateLog } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { SimpleTable } from '@/components/DetailView/common/SimpleTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { Card, Stack } from '@mui/material'
import { MRT_ColumnDef, MRT_Row, MRT_RowData } from 'material-react-table'
import { Link } from 'react-router-dom'

const ReferenceList = ({ references, big }: { references: ReferenceDetailsType[]; big: boolean }) => {
  const getReferenceText = (ref: ReferenceDetailsType) => {
    // TODO create different reference texts for different types.
    // php version: html/include/database.php -> referenceCitation()
    return `${ref.title_primary} ${ref.ref_journal?.journal_title ?? ''} ${ref.date_primary}`
  }
  return (
    <Stack>
      {references.map(ref => (
        <Card key={ref.rid} sx={{ padding: '0.4em', margin: '0.5em', maxWidth: big ? '50em' : '30em' }}>
          <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{getReferenceText(ref)}</div>
          {big && (
            <div>
              <Link to={`/reference/${ref.rid}`}>View</Link>
            </div>
          )}
        </Card>
      ))}
    </Stack>
  )
}

export const UpdateTab = <T, UpdateType extends MRT_RowData & { updates: UpdateLog[] }>({
  prefix,
  refFieldName,
  updatesFieldName,
}: {
  prefix: string
  refFieldName: keyof UpdateType
  updatesFieldName: keyof T
}) => {
  const { data } = useDetailContext<T>()

  const formatDate = (date: Date | null) => {
    if (!date) return 'No date'
    return new Date(date).toISOString().split('T')[0]
  }

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
        <ReferenceList
          references={(row.original[refFieldName] as { ref_ref: ReferenceDetailsType }[]).map(item => item.ref_ref)}
          big={false}
        />
      ),
    },
    {
      header: 'Details',
      Cell: ({ row }: { row: MRT_Row<UpdateType> }) => (
        <DetailsModal
          updates={row.original.updates}
          references={row.original[refFieldName] as { ref_ref: ReferenceDetailsType }[]}
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

const DetailsModal = <RefType extends { ref_ref: ReferenceDetailsType }>({
  updates,
  references,
}: {
  updates: UpdateLog[]
  references: RefType[]
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
      <ReferenceList references={references.map(ref => ref.ref_ref)} big />
      <SimpleTable columns={columns} data={updates} />
    </EditingModal>
  )
}
