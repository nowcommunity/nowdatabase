import { Editable, SpeciesDetailsType, SpeciesSynonym } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useForm } from 'react-hook-form'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingModal } from '@/components/DetailView/common/EditingModal'

export const SynonymTab = () => {
  const { mode } = useDetailContext<SpeciesDetailsType>()
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
        {!mode.read && editingModal}
        <EditableTable<Editable<SpeciesSynonym>, SpeciesDetailsType>
          columns={columns}
          editable
          field="com_taxa_synonym"
        />
      </Grouped>
    </>
  )
}
