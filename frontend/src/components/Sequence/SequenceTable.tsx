import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllSequencesQuery } from '../../redux/sequenceReducer'
import { Sequence } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const SequenceTable = ({ selectorFn }: { selectorFn?: (id: Sequence) => void }) => {
  const sequenceQuery = useGetAllSequencesQuery()
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

  return (
    <TableView<Sequence>
      selectorFn={selectorFn}
      idFieldName="sequence"
      columns={columns}
      data={sequenceQuery.data}
      url="sequence"
    />
  )
}
