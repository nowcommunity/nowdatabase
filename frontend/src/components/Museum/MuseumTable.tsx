import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllMuseumsQuery } from '../../redux/museumReducer'
import { TableView } from '../TableView/TableView'
import { Museum } from '@/shared/types'

export const MuseumTable = ({ selectorFn }: { selectorFn?: (museum: Museum) => void }) => {
  const { data: museumQueryData, isFetching } = useGetAllMuseumsQuery()

  /*
    museum: string;
    institution: string;
    alt_int_name: string | null;
    city: string | null;
    state_code: string | null;
    state: string | null;
    country: string | null;
    used_morph: boolean | null;
    used_now: boolean | null;
    used_gene: boolean | null;
  */

  const columns = useMemo<MRT_ColumnDef<Museum>[]>(
    () => [
      {
        accessorKey: 'museum',
        header: 'Museum',
        size: 20,
        enableColumnFilterModes: false,
      },
      {
        id: 'institution',
        accessorFn: row => row.institution || '',
        header: 'Institution',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'city',
        accessorFn: row => row.city || '',
        header: 'City',
        size: 20,
        filterFn: 'contains',
      },
      {
        id: 'state',
        accessorFn: row => row.state || '',
        header: 'State',
        filterFn: 'contains',
      },
      {
        id: 'state_code',
        accessorFn: row => row.state_code || '',
        header: 'State code',
        filterFn: 'contains',
      },
      {
        id: 'country',
        accessorFn: row => row.country || '',
        header: 'Country',
        filterFn: 'contains',
      },
    ],
    []
  )

  const visibleColumns = {
    museum: false,
    institution: true,
    city: true,
    state: false,
    state_code: false,
    country: true,
  }

  const museums = museumQueryData?.filter(museum => museum.institution !== '[missing details]')

  return (
    <TableView<Museum>
      title="Museum"
      selectorFn={selectorFn}
      idFieldName="museum"
      columns={columns}
      isFetching={isFetching}
      visibleColumns={visibleColumns}
      data={museums}
      url="museum"
    />
  )
}
