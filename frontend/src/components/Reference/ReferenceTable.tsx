import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllReferencesQuery } from '../../redux/referenceReducer'
import { Reference } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const ReferenceTable = ({ selectorFn, selectedList }: { selectorFn?: ((id: string) => void); selectedList?: string[] }) => {
  const referenceQuery = useGetAllReferencesQuery({})
  const columns = useMemo<MRT_ColumnDef<Reference>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'rid',
        header: 'Reference Id',
        size: 20,
      },
      {
        accessorKey: 'first_author',
        header: 'Author',
      },
      {
        accessorKey: 'date_primary',
        header: 'Year',
        size: 20,
      },
      {
        accessorKey: 'title_primary',
        header: 'Title',
        size: 20,
      },
      {
        accessorKey: 'journal_title',
        header: 'Journal',
      },
      {
        accessorKey: 'title_secondary',
        header: 'Book Title',
      },
      {
        accessorKey: 'ref_type',
        header: 'Type',
      },
    ],
    []
  )
  const checkRowRestriction = () => {
    return false
  }

  return (
    <TableView<Reference>
      selectorFn={selectorFn}
      selectedList={selectedList}
      checkRowRestriction={checkRowRestriction}
      idFieldName="rid"
      columns={columns}
      data={referenceQuery.data}
      url="reference"
    />
  )
}
