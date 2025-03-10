import { ReferenceDetailsType } from '@/shared/types'
import { useGetReferenceSpeciesQuery } from '@/redux/referenceReducer'
import { CircularProgress } from '@mui/material'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SimpleTable } from '@/components/DetailView/common/SimpleTable'

export const SpeciesTab = () => {
  const { data } = useDetailContext<ReferenceDetailsType>()
  const { data: speciesData, isError } = useGetReferenceSpeciesQuery(encodeURIComponent(data.rid))

  if (isError) return 'Error loading Species.'
  if (!speciesData) return <CircularProgress />

  const columns = [
    {
      accessorKey: 'order_name',
      header: 'Order',
    },
    {
      accessorKey: 'family_name',
      header: 'Family',
    },
    {
      accessorKey: 'genus_name',
      header: 'Genus',
    },
    {
      accessorKey: 'species_name',
      header: 'Species',
    },
    {
      accessorKey: 'subclass_or_superorder_name',
      header: 'Subclass or Superorder',
    },
    {
      accessorKey: 'suborder_or_superfamily_name',
      header: 'Suborder or Superfamily',
    },
    {
      accessorKey: 'unique_identifier',
      header: 'Unique Identifier',
    },
    {
      accessorKey: 'taxonomic_status',
      header: 'Taxon status',
    },
  ]

  return <SimpleTable columns={columns} data={speciesData} idFieldName="species_id" url="species" />
}
