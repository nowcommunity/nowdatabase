import { Editable, LocalityDetailsType, LocalitySpecies } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'

export const SpeciesTab = () => {
  const { mode } = useDetailContext<LocalityDetailsType>()
  const {
    register,
    formState: { errors },
  } = useForm()

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
  ]

  // eslint-disable-next-line @typescript-eslint/require-await
  const onSave = async () => {
    // TODO: Saving logic here (add Species to editData)
    return Object.keys(errors).length === 0
  }

  const editingModal = (
    <EditingModal buttonText="Add new Species" onSave={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <TextField {...register('com_species.order_name', { required: true })} label="Order" />
        <TextField {...register('com_species.family_name', { required: true })} label="Family" />
        <TextField {...register('com_species.genus_name', { required: true })} label="Genus" />
        <TextField {...register('com_species.species_name', { required: true })} label="Species" />
        <TextField
          {...register('com_species.subclass_or_superorder_name', { required: true })}
          label="Subclass or Superorder"
        />
        <TextField
          {...register('com_species.suborder_or_superfamily_name', { required: true })}
          label="Suborder or Superfamily"
        />
        <TextField {...register('com_species.unique_identifier', { required: true })} label="Unique Identifier" />
        <TextField {...register('com_species.taxonomic_status')} label="Taxon status" />
      </Box>
    </EditingModal>
  )

  return (
    <Grouped title="Species">
      {!mode.read && (
        <Box display="flex" gap={1}>
          <SelectingTable<LocalitySpecies, LocalityDetailsType>
            buttonText="Select Museum"
            data={museumData}
            columns={columns}
            fieldName="museums"
            idFieldName="museum"
          />
        </Box>
      )}
      <EditableTable<Editable<Museum>, LocalityDetailsType> columns={columns} field="museums" />
    </Grouped>
  )
}
