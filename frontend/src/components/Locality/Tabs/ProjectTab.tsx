import { Editable, LocalityDetailsType, LocalityProject } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useForm } from 'react-hook-form'

export const ProjectTab = () => {
  const { mode } = useDetailContext<LocalityDetailsType>()
  const {
    register,
    formState: { errors },
  } = useForm()

  const columns: MRT_ColumnDef<LocalityProject>[] = [
    {
      accessorKey: 'now_proj.proj_code',
      header: 'Code',
    },
    {
      accessorKey: 'now_proj.proj_name',
      header: 'Project',
    },
    {
      accessorKey: 'now_proj.contact',
      header: 'Contact',
    },
    {
      accessorKey: 'now_proj.proj_status',
      header: 'Status',
    },
    {
      accessorKey: 'now_proj.proj_records',
      header: 'Records',
    },
  ]

  // eslint-disable-next-line @typescript-eslint/require-await
  const onSave = async () => {
    // TODO: Saving logic here (add Project to editData)
    return Object.keys(errors).length === 0
  }

  const editingModal = (
    <EditingModal buttonText="Add new Project" onSave={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <TextField {...register('now_proj.code', { required: true })} label="Code" required />
        <TextField {...register('now_proj.proj_name', { required: true })} label="Project" required />
        <TextField {...register('now_proj.contact')} label="Contact" />
        <TextField {...register('now_proj.proj_status', { required: true })} label="Status" required />
        <TextField {...register('now_proj.proj_records', { required: true })} label="Records" required />
      </Box>
    </EditingModal>
  )

  return (
    <Grouped title="Projects">
      {!mode.read && editingModal}
      <EditableTable<Editable<LocalityProject>, LocalityDetailsType> columns={columns} editable field="now_plr" />
    </Grouped>
  )
}
