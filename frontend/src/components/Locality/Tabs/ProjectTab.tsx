import { Editable, LocalityDetails, LocalityProject, Project } from '@/backendTypes'
import { EditableTable, EditingModal, Grouped } from '@/components/DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const ProjectTab = () => {
  const { editData, mode } = useDetailContext<LocalityDetails>()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [data, setData] = useState('')

  const columns: MRT_ColumnDef<LocalityProject>[] = [
    {
      accessorKey: 'proj_code',
      header: 'Code',
    },
    {
      accessorKey: 'proj_name',
      header: 'Project',
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
    },
    {
      accessorKey: 'proj_status',
      header: 'Status',
    },
    {
      accessorKey: 'proj_records',
      header: 'Records',
    },
  ]

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
      <EditableTable<Editable<Project>, LocalityDetails>
        columns={columns}
        data={editData.now_proj}
        editable
        field="now_proj"
      />
    </Grouped>
  )
}
