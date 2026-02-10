import { Editable, SpeciesDetailsType, SpeciesLocality } from '@/shared/types'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef, MRT_Row } from 'material-react-table'
import { matchesCountryOrContinent } from '@/shared/validators/countryContinents'
import { useForm } from 'react-hook-form'
import { calculateNormalizedMesowearScore } from '@/shared/utils/mesowear'

const hasMesowearScoreInputs = (row: SpeciesLocality) => {
  return (
    'mw_scale_min' in row &&
    'mw_scale_max' in row &&
    'mw_value' in row &&
    row.mw_scale_min !== undefined &&
    row.mw_scale_max !== undefined &&
    row.mw_value !== undefined
  )
}

export const LocalitySpeciesTab = () => {
  const { mode } = useDetailContext<SpeciesDetailsType>()
  const {
    register,
    formState: { errors },
  } = useForm()

  const columns: MRT_ColumnDef<SpeciesLocality>[] = [
    {
      accessorKey: 'now_loc.loc_name',
      header: 'Locality',
    },
    {
      accessorKey: 'now_loc.country',
      header: 'Country or Continent',
      filterFn: (row, columnId, filterValue) => {
        const search =
          typeof filterValue === 'string' ? filterValue : Array.isArray(filterValue) ? filterValue.join(' ') : ''

        return matchesCountryOrContinent(row.getValue<string>(columnId) ?? '', search)
      },
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
      Cell: ({ row }: { row: MRT_Row<SpeciesLocality> }) => {
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
    // TODO: Saving logic here (add Locality to editData)
    return Object.keys(errors).length === 0
  }

  const editingModal = (
    <EditingModal buttonText="Add new Locality Species" onSave={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <TextField {...register('now_loc.name', { required: true })} label="Locality" />
        <TextField {...register('now_loc.country', { required: true })} label="Country" />
        <TextField {...register('now_loc.dms_lat', { required: true })} label="Latitude dms" />
        <TextField {...register('now_loc.dms_lon', { required: true })} label="Longitude dms" />
        <TextField {...register('now_loc.max_age', { required: true })} label="Maximum Age" />
        <TextField {...register('now_loc.min_age', { required: true })} label="Minimum Age" />
        <TextField {...register('now_loc.bfa_max_abs', { required: true })} label="Basis for Age Maximum" />
        <TextField {...register('now_loc.bfa_min_abs', { required: true })} label="Basis for Age Minimum" />
      </Box>
    </EditingModal>
  )

  return (
    <Grouped title="Locality-Species Information">
      {!mode.read && editingModal}
      <EditableTable<Editable<SpeciesLocality>, SpeciesDetailsType> columns={columns} field="now_ls" />
    </Grouped>
  )
}
