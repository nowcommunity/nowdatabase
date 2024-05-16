import { Editable, SpeciesDetails, SpeciesSynonym } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/hooks'
import {
  EditableTable,
  EditingModal,
  Grouped,
  ArrayFrame,
  HalfFrames,
} from '@/components/DetailView/common/FormComponents'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useForm } from 'react-hook-form'

export const SynonymTab = () => {
  const { textField } = useDetailContext<SpeciesDetails>()

  const { editData, mode } = useDetailContext<SpeciesDetails>()
  const {
    register,
    formState: { errors },
  } = useForm()

  const columns: MRT_ColumnDef<SpeciesSynonym>[] = [
    {
      accessorKey: 'syn_genus_name',
      header: 'Genus',
    },
    {
      accessorKey: 'syn_species_name',
      header: 'Species',
    },
    {
      accessorKey: 'syn_comment',
      header: 'Comment',
    },
  ]

  // eslint-disable-next-line @typescript-eslint/require-await
  const onSave = async () => {
    // TODO: Saving logic here (add Synonym to editData)
    return Object.keys(errors).length === 0
  }

  const editingModal = (
    <EditingModal buttonText="Add new Synonym" onSave={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <TextField {...register('syn_genus_name', { required: true })} label="Genus" required />
        <TextField {...register('syn_species_name', { required: true })} label="Species" required />
        <TextField {...register('syn_comment', { required: true })} label="Comment" required />
      </Box>
    </EditingModal>
  )

  return (
    <>
      <Grouped title="Synonyms">
        {mode === 'edit' && editingModal}
        <EditableTable<Editable<SpeciesSynonym>, SpeciesDetails>
          columns={columns}
          data={editData.com_taxa_synonym}
          editable
          field="com_taxa_synonym"
        />
      </Grouped>
    </>
  )
}
