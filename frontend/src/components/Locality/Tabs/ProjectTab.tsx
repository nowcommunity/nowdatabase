import { Editable, LocalityDetails, LocalityProject } from '@/backendTypes'
import { EditableTable, EditingModal, Grouped } from '@/components/DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useForm } from 'react-hook-form'

export const ProjectTab = () => {
  const { editData, mode } = useDetailContext<LocalityDetails>()
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
      {mode === 'edit' && editingModal}
      <EditableTable<Editable<LocalityProject>, LocalityDetails>
        columns={columns}
        data={editData.now_plr}
        editable
        field="now_plr"
      />
    </Grouped>
  )
}
