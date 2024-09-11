import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllCrossSearchQuery, useGetCrossSearchListMutation } from '../../redux/crossSearchReducer'
import { CrossSearch } from '@/backendTypes'
import { TableView } from '../TableView/TableView'
import { useNotify } from '@/hooks/notification'

export const CrossSearchTable = ({ selectorFn }: { selectorFn?: (newObject: CrossSearch) => void }) => {
  const CrossSearchQuery = useGetAllCrossSearchQuery()
  const [getCrossSearchList, { isLoading }] = useGetCrossSearchListMutation()
  const notify = useNotify()
  const columns = useMemo<MRT_ColumnDef<CrossSearch>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'lid',
        header: 'Id',
        size: 20,
      },
      {
        accessorKey: 'loc_name',
        header: 'Name',
      },
      {
        accessorKey: 'country',
        header: 'Country',
      },
      {
        accessorKey: 'max_age',
        header: 'Max age',
        filterVariant: 'range',
      },
      {
        accessorKey: 'min_age',
        header: 'Min age',
        filterVariant: 'range',
      },
      {
        accessorKey: 'subclass_or_superorder_name',
        header: 'Subclass or Superorder',
        size: 20,
      },
      {
        accessorKey: 'order_name',
        header: 'Order',
        size: 20,
      },
      {
        accessorKey: 'suborder_or_superfamily_name',
        header: 'Suborder or Superfamily',
        size: 20,
      },
      {
        accessorKey: 'family_name',
        header: 'Family',
        size: 20,
      },
      {
        accessorKey: 'subfamily_name',
        header: 'Subfamily or Tribe',
        size: 20,
      },
      {
        accessorKey: 'genus_name',
        header: 'Genus',
        size: 20,
      },
      {
        accessorKey: 'species_name',
        header: 'Species',
        size: 20,
      },
      {
        accessorKey: 'unique_identifier',
        header: 'Unique Identifier',
        size: 20,
      },
      {
        accessorKey: 'taxonomic_status',
        header: 'Taxonomic Status',
        size: 20,
      },
    ],
    []
  )

  const combinedExport = async (lids: number[]) => {
    if (isLoading) {
      notify('Please wait for the last request to complete.', 'warning')
      return
    }

    const limit = 99999999
    if (lids.length > limit) {
      notify(`Please filter the table more. Current rows: ${lids.length}. Limit: ${limit}`, 'error')
      return
    }
    const result = await getCrossSearchList(lids).unwrap()
    const dataString = result.map(row => row.join(',')).join('\n')
    const blob = new Blob([dataString], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'localitiesWithSpecies.csv'
    a.click()
  }

  const checkRowRestriction = (row: CrossSearch) => {
    return !!row.loc_status
  }

  return (
    <TableView<CrossSearch>
      title="Locality-Species-Cross-Search (UNDER CONSTRUCTION)"
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="lid"
      columns={columns}
      data={CrossSearchQuery.data}
      url="crosssearch"
      combinedExport={combinedExport}
      exportIsLoading={isLoading}
    />
  )
}
