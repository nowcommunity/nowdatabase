import { MRT_ColumnDef, MRT_PaginationState } from 'material-react-table'
import { Reference, PersonDetailsType } from './shared/types'
import { Cell } from './components/commonComponents'

export const formatLastLoginDate = (date: Date) => {
  const dateFormat = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
  return dateFormat.format(new Date(date))
}

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
    filterFn: 'contains',
  },
  {
    accessorKey: 'date_primary',
    header: 'Year',
    maxSize: 60,
    filterVariant: 'range',
  },
  {
    id: 'title_primary',
    accessorFn: ({ title_primary }) => title_primary ?? '',
    Cell,
    header: 'Title',
    maxSize: 60,
    filterFn: 'contains',
    enableHiding: false,
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

export const personTableColumns: MRT_ColumnDef<PersonDetailsType>[] = [
  {
    accessorKey: 'initials',
    id: 'person_id',
    header: 'Person Id',
  },
  {
    accessorKey: 'first_name',
    header: 'First name',
  },
  {
    accessorKey: 'surname',
    header: 'Surname',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'organization',
    header: 'Organisation',
  },
  {
    accessorKey: 'country',
    header: 'Country',
  },
  {
    id: 'user_id',
    accessorFn: person => person.user?.user_id ?? 'Not a user',
    header: 'User Id',
    size: 20,
  },
  {
    accessorFn: person => person.user?.user_name ?? 'None',
    header: 'User name',
  },
  {
    accessorFn: (person: PersonDetailsType) =>
      person.user?.last_login ? formatLastLoginDate(person.user?.last_login) : 'None',
    header: 'Last login',
  },
  {
    accessorKey: 'initials',
    header: 'Initials',
  },
  {
    accessorFn: person => person.user?.now_user_group ?? 'None',
    header: 'User role',
  },
]

export const emptyLocalitySpeciesFields = {
  nis: null,
  pct: null,
  quad: null,
  mni: null,
  qua: null,
  id_status: null,
  orig_entry: null,
  source_name: null,
  body_mass: null,
  mesowear: null,
  mw_or_high: null,
  mw_or_low: null,
  mw_cs_sharp: null,
  mw_cs_round: null,
  mw_cs_blunt: null,
  mw_scale_min: null,
  mw_scale_max: null,
  mw_value: null,
  microwear: null,
  dc13_mean: null,
  dc13_n: null,
  dc13_max: null,
  dc13_min: null,
  dc13_stdev: null,
  do18_mean: null,
  do18_n: null,
  do18_max: null,
  do18_min: null,
  do18_stdev: null,
}

export const defaultPagination: MRT_PaginationState = { pageIndex: 0, pageSize: 50 }
export const defaultPaginationSmall: MRT_PaginationState = { pageIndex: 0, pageSize: 10 }
