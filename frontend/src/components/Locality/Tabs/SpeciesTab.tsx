import { NewSpeciesForm } from '@/components/common/NewSpeciesForm'
import { applyDefaultSpeciesOrdering, hasActiveSortingInSearch } from '@/components/DetailView/common/DetailTabTable'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { EditDataType, LocalityDetailsType, LocalitySpeciesDetailsType, RowState, Species } from '@/shared/types'
import { fixNullValuesInTaxonomyFields } from '@/util/taxonomyUtilities'
import { Box, CircularProgress } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import { MRT_ColumnDef } from 'material-react-table'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { toSpeciesDetailsDraft } from '@/components/common/toSpeciesDetailsDraft'

export const SpeciesTab = () => {
  const { mode, editData, setEditData } = useDetailContext<LocalityDetailsType>()
  const location = useLocation()
  const { data: speciesData, isError } = useGetAllSpeciesQuery(mode.read ? skipToken : undefined)

  const hasUrlSorting = hasActiveSortingInSearch(location.search)

  const sortedSpeciesData = useMemo(() => {
    return applyDefaultSpeciesOrdering(speciesData, { skip: hasUrlSorting })
  }, [hasUrlSorting, speciesData])

  type LocalitySpeciesRow = EditDataType<LocalitySpeciesDetailsType> & { rowState?: RowState; index: number }

  const indexedLocalitySpeciesData = useMemo<LocalitySpeciesRow[]>(() => {
    return editData.now_ls.map((localitySpecies, index) => ({ ...localitySpecies, index }))
  }, [editData.now_ls])

  const sortedLocalitySpeciesData = useMemo(() => {
    return applyDefaultSpeciesOrdering(indexedLocalitySpeciesData, {
      prefix: 'com_species',
      skip: hasUrlSorting,
    })
  }, [indexedLocalitySpeciesData, hasUrlSorting])

  const speciesColumns: MRT_ColumnDef<Species>[] = [
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
  const localitySpeciesColumns: MRT_ColumnDef<LocalitySpeciesRow>[] = [
    {
      accessorKey: 'com_species.order_name',
      header: 'Order',
    },
    {
      accessorKey: 'com_species.family_name',
      header: 'Family',
    },
    {
      accessorKey: 'com_species.genus_name',
      header: 'Genus',
    },
    {
      accessorKey: 'com_species.species_name',
      header: 'Species',
    },
    {
      accessorKey: 'com_species.subclass_or_superorder_name',
      header: 'Subclass or Superorder',
    },
    {
      accessorKey: 'com_species.suborder_or_superfamily_name',
      header: 'Suborder or Superfamily',
    },
    {
      accessorKey: 'com_species.unique_identifier',
      header: 'Unique Identifier',
    },
    {
      accessorKey: 'com_species.taxonomic_status',
      header: 'Taxon status',
    },
    {
      accessorKey: 'com_species.sp_comment',
      header: 'Comment',
    },
    {
      accessorKey: 'com_species.sp_author',
      header: 'Author',
    },
  ]

  if (!mode.read && !speciesData) return <CircularProgress />

  return (
    <Grouped title="Species">
      {!mode.read && (
        <Box display="flex" gap={1}>
          <NewSpeciesForm
            existingLocalitySpecies={editData.now_ls}
            afterTaxonomyCheck={(convertedSpecies: EditDataType<Species>) => {
              setEditData({
                ...editData,
                now_ls: [
                  ...editData.now_ls,
                  {
                    lid: editData.lid,
                    species_id: undefined,
                    com_species: toSpeciesDetailsDraft(fixNullValuesInTaxonomyFields(convertedSpecies)),
                    rowState: 'new',
                  },
                ],
              })
            }}
          />
          <SelectingTable<Species, LocalityDetailsType>
            buttonText="Select Species"
            data={sortedSpeciesData}
            title="Species"
            isError={isError}
            columns={speciesColumns}
            fieldName="now_ls"
            idFieldName="species_id"
            editingAction={(newSpecies: Species) => {
              setEditData({
                ...editData,
                now_ls: [
                  ...editData.now_ls,
                  {
                    lid: editData.lid,
                    species_id: newSpecies.species_id,
                    com_species: toSpeciesDetailsDraft(fixNullValuesInTaxonomyFields(newSpecies)),
                    rowState: 'new',
                  },
                ],
              })
            }}
          />
        </Box>
      )}
      <EditableTable<LocalitySpeciesRow, LocalityDetailsType>
        columns={localitySpeciesColumns}
        field="now_ls"
        visible_data={sortedLocalitySpeciesData}
        enableAdvancedTableControls={true}
        idFieldName="species_id"
        url="species"
        useDefinedIndex={true}
      />
    </Grouped>
  )
}
