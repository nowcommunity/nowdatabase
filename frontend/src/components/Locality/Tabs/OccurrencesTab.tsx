import { Editable, LocalityDetailsType, LocalitySpecies } from '@/shared/types'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef, MRT_Row } from 'material-react-table'
import { useForm } from 'react-hook-form'
import { calculateNormalizedMesowearScore } from '@/shared/utils/mesowear'
import { applyDefaultSpeciesOrdering, hasActiveSortingInSearch } from '@/components/DetailView/common/DetailTabTable'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { occurrenceLabels } from '@/constants/occurrenceLabels'

const hasMesowearScoreInputs = (row: LocalitySpecies) => {
  return (
    'mw_scale_min' in row &&
    'mw_scale_max' in row &&
    'mw_value' in row &&
    row.mw_scale_min !== undefined &&
    row.mw_scale_max !== undefined &&
    row.mw_value !== undefined
  )
}

export const OccurrencesTab = () => {
  const { mode, data, editData } = useDetailContext<LocalityDetailsType>()
  const location = useLocation()
  const {
    register,
    formState: { errors },
  } = useForm()

  const sortedOccurrenceRows = useMemo(() => {
    const sourceRows = (mode.read ? data.now_ls : editData.now_ls) as unknown as Editable<LocalitySpecies>[]

    return (
      applyDefaultSpeciesOrdering(sourceRows, {
        prefix: 'com_species',
        skip: hasActiveSortingInSearch(location.search),
      }) ?? sourceRows
    )
  }, [data.now_ls, editData.now_ls, location.search, mode.read])

  const columns: MRT_ColumnDef<LocalitySpecies>[] = [
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
      accessorKey: 'id_status',
      header: 'ID Status',
    },
    {
      accessorKey: 'orig_entry',
      header: 'Additional Information',
    },
    {
      accessorKey: 'source_name',
      header: 'Source Name',
    },
    {
      accessorKey: 'nis',
      header: 'NIS',
    },
    {
      accessorKey: 'pct',
      header: 'PCT',
    },
    {
      accessorKey: 'quad',
      header: 'QUAD',
    },
    {
      accessorKey: 'mni',
      header: 'MNI',
    },
    {
      accessorKey: 'qua',
      header: 'QUA',
    },
    {
      accessorKey: 'body_mass',
      header: 'Body Mass (g)',
    },
    {
      accessorKey: 'mesowear',
      header: 'Mesowear',
    },
    {
      accessorKey: 'mw_or_low',
      header: 'MW Low',
    },
    {
      accessorKey: 'mw_or_high',
      header: 'MW High',
    },
    {
      accessorKey: 'mw_cs_sharp',
      header: 'MW Sharp',
    },
    {
      accessorKey: 'mw_cs_round',
      header: 'MW Round',
    },
    {
      accessorKey: 'mw_cs_blunt',
      header: 'MW Blunt',
    },
    {
      accessorKey: 'mw_scale_min',
      header: 'MW Scale Min',
    },
    {
      accessorKey: 'mw_scale_max',
      header: 'MW Scale Max',
    },
    {
      accessorKey: 'mw_value',
      header: 'MW Value',
    },
    {
      header: 'MW Score',
      Cell: ({ row }: { row: MRT_Row<LocalitySpecies> }) => {
        if (!hasMesowearScoreInputs(row.original)) {
          return <Box />
        }

        const score = calculateNormalizedMesowearScore(
          row.original.mw_scale_min,
          row.original.mw_scale_max,
          row.original.mw_value
        )

        return <Box>{score ?? ''}</Box>
      },
    },
    {
      accessorKey: 'microwear',
      header: 'Microwear',
    },
    {
      accessorKey: 'dc13_mean',
      header: 'dC13 Mean',
    },
    {
      accessorKey: 'dc13_n',
      header: 'dC13 n',
    },
    {
      accessorKey: 'dc13_max',
      header: 'dC13 Max',
    },
    {
      accessorKey: 'dc13_min',
      header: 'dC13 Min',
    },
    {
      accessorKey: 'dc13_stdev',
      header: 'dC13 STDEV',
    },
    {
      accessorKey: 'do18_mean',
      header: 'dO18 Mean',
    },
    {
      accessorKey: 'do18_n',
      header: 'dO18 n',
    },
    {
      accessorKey: 'do18_max',
      header: 'dO18 Max',
    },
    {
      accessorKey: 'do18_min',
      header: 'dO18 Min',
    },
    {
      accessorKey: 'do18_stdev',
      header: 'dO18 STDEV',
    },
  ]

  // eslint-disable-next-line @typescript-eslint/require-await
  const onSave = async () => {
    // TODO: Saving logic here (add Occurrence to editData)
    return Object.keys(errors).length === 0
  }

  const editingModal = (
    <EditingModal buttonText={occurrenceLabels.addNewButton} onSave={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <TextField {...register('com_species.order_name', { required: true })} label="Order" />
        <TextField {...register('com_species.family_name', { required: true })} label="Family" />
        <TextField {...register('com_species.genus_name', { required: true })} label="Genus" />
        <TextField {...register('com_species.species_name', { required: true })} label="Species" />
        <TextField {...register('com_species.unique_identifier', { required: true })} label="Unique Identifier" />
      </Box>
    </EditingModal>
  )

  return (
    <Grouped title={occurrenceLabels.informationSectionTitle}>
      {!mode.read && editingModal}
      <EditableTable<Editable<LocalitySpecies>, LocalityDetailsType>
        columns={columns}
        field="now_ls"
        visible_data={sortedOccurrenceRows}
        enableAdvancedTableControls={true}
        idFieldName="species_id"
        url="occurrence"
        getDetailPath={row => `/occurrence/${row.lid}/${row.species_id}`}
      />
    </Grouped>
  )
}
