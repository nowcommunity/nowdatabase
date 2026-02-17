import { ReferenceDetailsType } from '@/shared/types'
import { useGetReferenceSpeciesQuery } from '@/redux/referenceReducer'
import { CircularProgress } from '@mui/material'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SimpleTable } from '@/components/DetailView/common/SimpleTable'
import { applyDefaultSpeciesOrdering, hasActiveSortingInSearch } from '@/components/DetailView/common/DetailTabTable'
import { useLocation } from 'react-router-dom'

export const SpeciesTab = () => {
  const { data } = useDetailContext<ReferenceDetailsType>()
  const location = useLocation()
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

  const sortedSpeciesData = applyDefaultSpeciesOrdering(speciesData, {
    skip: hasActiveSortingInSearch(location.search),
  })

  return <SimpleTable columns={columns} data={sortedSpeciesData} idFieldName="species_id" url="species" />
}
