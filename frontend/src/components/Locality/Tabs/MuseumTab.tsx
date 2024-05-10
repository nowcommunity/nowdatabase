import { Editable, LocalityDetails, Museum } from '@/backendTypes'
import { EditableTable, EditingModal, Grouped } from '@/components/DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const MuseumTab = () => {
  const { editData, mode } = useDetailContext<LocalityDetails>()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [data, setData] = useState('')

  const columns: MRT_ColumnDef<Museum>[] = [
    {
      accessorKey: 'museum',
      header: 'Code',
    },
    {
      accessorKey: 'institution',
      header: 'Museum',
    },
    {
      accessorKey: 'city',
      header: 'City',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
  ]

  const onSave = async () => {
    // TODO: Saving logic here (add museum to editData)
    return Object.keys(errors).length === 0
  }

  const editingModal = (
    <EditingModal buttonText="Add new museum" onSave={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <TextField {...register('code', { required: true })} label="Code" required />
        <TextField {...register('museum', { required: true })} label="Museum" required />
        <TextField {...register('alternativeName')} label="Alternative name" />
        <TextField {...register('city', { required: true })} label="City" required />
        <TextField {...register('state')} label="State" />
        <TextField {...register('stateCode')} label="State code" />
        <TextField {...register('country', { required: true })} label="Country" required />
      </Box>
    </EditingModal>
  )

  return (
    <Grouped title="Museums">
      {mode === 'edit' && editingModal}
      <EditableTable<Editable<Museum>, LocalityDetails>
        columns={columns}
        data={editData.museums}
        editable
        field="museums"
      />
    </Grouped>
  )
}
