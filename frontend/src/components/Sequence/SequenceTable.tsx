import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetSequencesQuery } from '../../redux/timeUnitReducer'
import { Sequence } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const SequenceTable = ({ selectorFn }: { selectorFn?: (id: Sequence) => void }) => {
  const sequenceQuery = useGetSequencesQuery()
  const columns = useMemo<MRT_ColumnDef<Sequence>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'sequence',
        header: 'Sequence Id',
        size: 20,
      },
      {
        accessorKey: 'seq_name',
        header: 'Sequence Name',
        maxSize: 60,
      },
    ],
    []
  )

  const hiddenColumns = {
    id: false,
  }

  return (
    <TableView<Sequence>
      selectorFn={selectorFn}
      idFieldName="sequence"
      columns={columns}
      hiddenColumns={hiddenColumns}
      data={sequenceQuery.data}
      url="sequence"
    />
  )
}
