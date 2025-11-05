import { useEffect, useMemo, useState } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetSequencesQuery } from '@/redux/timeUnitReducer'
import { Sequence } from '@/shared/types'
import { TableView } from '../TableView/TableView'
import { Table } from '@/components/Table/Table'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'
import { defaultPaginationSmall } from '@/common'

const TABLE_ID = 'time-unit-sequences'

export const SequenceTable = ({ selectorFn }: { selectorFn?: (id: Sequence) => void }) => {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = defaultPaginationSmall.pageSize

  const queryArg = useMemo(
    () => ({
      limit: pageSize,
      offset: pageIndex * pageSize,
    }),
    [pageIndex, pageSize]
  )

  const {
    data: sequenceQueryData,
    isFetching,
    pagination,
  } = usePaginatedQuery(useGetSequencesQuery, {
    tableId: TABLE_ID,
    queryArg,
    manualPageIndex: pageIndex,
    manualPageSize: pageSize,
  })

  useEffect(() => {
    if (!pagination) {
      if (pageIndex !== 0) {
        setPageIndex(0)
      }
      return
    }

    const { totalPages } = pagination

    if (totalPages === 0 && pageIndex !== 0) {
      setPageIndex(0)
      return
    }

    if (totalPages > 0 && pageIndex > totalPages - 1) {
      setPageIndex(totalPages - 1)
    }
  }, [pagination, pageIndex])
  const columns = useMemo<MRT_ColumnDef<Sequence>[]>(
    () => [
      {
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

  const visibleColumns = {
    sequence: false,
  }

  return (
    <Table tableId={TABLE_ID} onPageChange={setPageIndex} isLoading={isFetching} paginationPlacement="top">
      <TableView<Sequence>
        selectorFn={selectorFn}
        idFieldName="sequence"
        columns={columns}
        title="Sequences"
        isFetching={isFetching}
        visibleColumns={visibleColumns}
        clickableRows={false}
        data={sequenceQueryData}
        url="sequence"
      />
    </Table>
  )
}
