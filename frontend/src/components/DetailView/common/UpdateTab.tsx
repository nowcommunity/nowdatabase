import { ReferenceOfUpdate, UpdateLog } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { SimpleTable } from '@/components/DetailView/common/SimpleTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { Box, Card, Divider, Stack } from '@mui/material'
import { MRT_ColumnDef, MRT_Row, MRT_RowData } from 'material-react-table'
import { Link } from 'react-router-dom'

const makeNameList = (names: Array<string | null>) => {
  if (names.length === 3) {
    return `${names[0]}, ${names[1]} & ${names[2]}`
  } else if (names.length >= 4) {
    return `${names[0]} et al.`
  } else if (names.length === 2) {
    return `${names[0]} & ${names[1]}`
  }
  return names[0] ?? ''
}

const ReferenceList = ({ references, big }: { references: ReferenceOfUpdate[]; big: boolean }) => {
  const getReferenceText = (ref: ReferenceOfUpdate) => {
    // php version: html/include/database.php -> referenceCitation()
    const authors = makeNameList(ref.ref_authors.map(author => author.author_surname))
    const issue = ref.issue ? ` (${ref.issue}) ` : ''
    if (ref.ref_type_id === 1) {
      // Journal
      return `${authors} (${ref.date_primary ?? ''}). ${ref.title_primary ?? ''}. ${ref.ref_journal?.journal_title ?? ''} ${ref.volume ?? ''}${issue}${ref.start_page ?? ref.end_page ? ': ' : ''}${ref.start_page ?? ''}${ref.start_page && ref.end_page ? '-' : ''}${ref.end_page ?? ''}${ref.start_page || ref.end_page ? '.' : ''}${ref.publisher || ref.pub_place ? `${ref.publisher || ''} ${ref.pub_place}.` : ''}`
    } else if (ref.ref_type_id === 2) {
      // Book
      // It seems that if field_id of authors are 12, they are editors instead and should not be shown in book
      return `${ref.ref_authors[0]?.field_id !== 12 ? authors : ''} (${ref.date_primary ?? ''}). ${ref.title_primary ?? ''}. ${ref.publisher || ref.pub_place ? ' ' : ''}${ref.publisher ?? ''}${ref.publisher && ref.pub_place ? ', ' : ''}${ref.pub_place ?? ''}${ref.publisher || ref.pub_place ? '.' : ''}`
    } else if (ref.ref_type_id === 3) {
      // Book chapter
      return `${authors} ${ref.ref_authors.length > 1 ? '(eds)' : ref.ref_authors.length === 1 ? '(ed)' : ''} ${ref.title_primary ?? ''}. IN: ${authors} ${ref.title_secondary ?? ''}. ${ref.start_page || ref.end_page ? 'pp.' : ''}${ref.start_page ?? ''}${ref.start_page && ref.end_page ? '-' : ''}${ref.end_page ?? ''}. ${ref.publisher || ref.pub_place ? ' ' : ''}${ref.publisher ?? ''}${ref.publisher && ref.pub_place ? ', ' : ''}${ref.publisher || ref.pub_place ? '.' : ''}`
    }
    // All other types
    return `${authors} ${ref.date_primary ? `(${ref.date_primary}). ` : ''} ${ref.title_primary?.concat('. ') ?? ''}${ref.title_secondary?.concat('. ') ?? ''}${ref.title_series?.concat('. ') ?? ''}${ref.gen_notes?.concat('.') ?? ''}`
  }
  return (
    <Stack>
      {references.map(ref => (
        <Card
          key={ref.rid}
          sx={{ padding: '0.4em', margin: '0.5em', maxWidth: big ? '50em' : '30em', backgroundColor: 'lightblue' }}
        >
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

const formatDate = (date: Date | null) => {
  if (!date) return 'No date'
  return new Date(date).toISOString().split('T')[0]
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
          references={(row.original[refFieldName] as { ref_ref: ReferenceOfUpdate }[]).map(item => item.ref_ref)}
          big={false}
        />
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
          references={row.original[refFieldName] as { ref_ref: ReferenceOfUpdate }[]}
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

const DetailsModal = <RefType extends { ref_ref: ReferenceOfUpdate }>({
  updates,
  references,
  comment,
  date,
  authorizer,
  coordinator,
}: {
  updates: UpdateLog[]
  references: RefType[]
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
            <b>Authorizer:</b> {authorizer}
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
      {references.length === 0 ? (
        <Box>Update has no references.</Box>
      ) : (
        <ReferenceList references={references.map(ref => ref.ref_ref)} big />
      )}
      <Divider />
      <h3>Changed database values</h3>
      <SimpleTable columns={columns} data={updates} />
    </EditingModal>
  )
}
