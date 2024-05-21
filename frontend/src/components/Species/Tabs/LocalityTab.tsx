import { Editable, SpeciesDetails, SpeciesLocality, Locality } from '@/backendTypes'
import { EditingModal, FormTextField, Grouped } from '@/components/DetailView/common/FormComponents'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { useDetailContext } from '@/components/DetailView/hooks'
import { TableView } from '@/components/TableView/TableView'
import { useGetAllLocalitiesQuery } from '@/redux/localityReducer'
import { Box, CircularProgress } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const LocalitySelectingTable = () => {
  const { data, isError } = useGetAllLocalitiesQuery()
  const [selected, setSelected] = useState<string[]>([])
  if (isError) return 'Error loading Localities.'
  if (!data) return <CircularProgress />

  const selectId = (id: string) => {
    const index = selected.indexOf(id)
    if (index < 0) {
      setSelected([...selected, id])
    } else {
      const newSelected = [...selected]
      newSelected.splice(index, 1)
      setSelected(newSelected)
    }
  }

  // Fields for selecting existing Localities
  const columns: MRT_ColumnDef<Locality>[] = [
    {
      accessorKey: 'loc_name',
      header: 'Locality',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
    {
      accessorKey: 'max_age',
      header: 'Max Age',
    },
    {
      accessorKey: 'min_age',
      header: 'Min Age',
    },
  ]

  return (
    <TableView<Locality>
      data={data}
      columns={columns}
      selectorFn={selectId}
      selectedList={selected}
      idFieldName="lid"
    />
  )
}

export const LocalityTab = () => {
  const { editData, mode } = useDetailContext<SpeciesDetails>()
  const {
    register,
    trigger,
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
      accessorKey: 'now_loc.max_age',
      header: 'Max Age',
    },
    {
      accessorKey: 'now_loc.min_age',
      header: 'Min Age',
    },
  ]

  const onSave = async () => {
    // TODO: Saving logic here (add Locality to editData)
    const result = await trigger()
    return result
  }

  const formFields: { name: string; label: string; required?: boolean }[] = [
    { name: 'name', label: 'Locality', required: true },
    { name: 'country', label: 'Country', required: true },
    { name: 'dms_lat', label: 'Latitude dms' },
    { name: 'dms_lon', label: 'Longitude dms', required: true },
    { name: 'max_age', label: 'Maximum Age', required: true },
    { name: 'min_age', label: 'Minimum Age', required: true },
    { name: 'bfa_max_abs', label: 'Basis for Age Maximum', required: true },
    { name: 'bfa_min_abs', label: 'Basis for Age Minimum', required: true },
  ]

  const editingModal = (
    <EditingModal buttonText="Add new Locality" onSave={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        {formFields.map(field => (
          <FormTextField
            key={field.name}
            {...{ errors, register }}
            fieldName={field.name}
            label={field.label}
            required={!!field.required}
          />
        ))}
      </Box>
    </EditingModal>
  )

  const selectingTable = (
    <EditingModal buttonText="Add existing Locality" onSave={onSave}>
      <LocalitySelectingTable />
    </EditingModal>
  )

  return (
    <Grouped title="Localities">
      {mode === 'edit' && (
        <Box display="flex" gap={1}>
          {editingModal} {selectingTable}
        </Box>
      )}
      <EditableTable<Editable<SpeciesLocality>, SpeciesDetails>
        columns={columns}
        data={editData.now_ls}
        editable
        field="now_ls"
      />
    </Grouped>
  )
}
