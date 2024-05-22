import { Editable, SpeciesDetails, SpeciesLocality } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/hooks'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useForm } from 'react-hook-form'

export const LocalitySpeciesTab = () => {
  const { editData, mode } = useDetailContext<SpeciesDetails>()
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
      header: 'Country',
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
      header: 'MW Score',
      Cell: () => <Box>not implemented</Box>,
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
      {mode === 'edit' && editingModal}
      <EditableTable<Editable<SpeciesLocality>, SpeciesDetails>
        columns={columns}
        data={editData.now_ls}
        editable
        field="now_ls"
      />
    </Grouped>
  )
}
