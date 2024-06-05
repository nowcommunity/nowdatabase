import { MRT_ColumnDef } from 'material-react-table'
import { Reference } from './backendTypes'
import { Cell } from './components/commonComponents'

export const referenceTableColumns: MRT_ColumnDef<Reference>[] = [
  {
    id: 'id',
    accessorKey: 'rid',
    header: 'Reference Id',
    size: 20,
  },
  {
    accessorFn: ({ ref_authors }) => ref_authors.find(author => author.au_num === 1)?.author_surname ?? 'Not found',
    Cell,
    header: 'Author',
    maxSize: 60,
  },
  {
    accessorKey: 'date_primary',
    header: 'Year',
    maxSize: 60,
  },
  {
    accessorKey: 'title_primary',
    Cell,
    header: 'Title',
    maxSize: 60,
  },
  {
    accessorFn: ({ ref_journal }) => ref_journal?.journal_title || '',
    Cell,
    header: 'Journal',
    maxSize: 60,
  },
  {
    accessorKey: 'title_secondary',
    header: 'Book Title',
    Cell,
    maxSize: 60,
  },
  {
    accessorKey: 'ref_ref_type.ref_type',
    header: 'Type',
    maxSize: 60,
  },
]
