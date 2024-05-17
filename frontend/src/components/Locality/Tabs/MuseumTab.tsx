import { Editable, LocalityDetails, Museum } from '@/backendTypes'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { EditableTable, EditingModal, Grouped } from '@/components/DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { TableView } from '@/components/TableView/TableView'
import { useGetAllMuseumsQuery } from '@/redux/museumReducer'
import { Box, CircularProgress } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useState } from 'react'

const MuseumSelectingTable = () => {
  const { data, isError } = useGetAllMuseumsQuery()
  const [selected, setSelected] = useState<string[]>([])
  if (isError) return 'Error loading museums.'
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

  return (
    <TableView<Museum>
      data={data}
      columns={columns}
      selectorFn={selectId}
      selectedList={selected}
      idFieldName="museum"
    />
  )
}

export const MuseumTab = () => {
  const { editData, mode } = useDetailContext<LocalityDetails>()
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

  const formFields: { name: string; label: string; required?: boolean }[] = [
    { name: 'code', label: 'Code', required: true },
    { name: 'museum', label: 'Museum', required: true },
    { name: 'alternativeName', label: 'Alternative name' },
    { name: 'city', label: 'City', required: true },
    { name: 'state', label: 'State' },
    { name: 'stateCode', label: 'State code' },
    { name: 'country', label: 'Country', required: true },
  ]

  const editingModal = (
    <EditingForm<Museum, LocalityDetails>
      buttonText="Add new museum"
      formFields={formFields}
      arrayFieldName="museums"
    />
  )
  const selectingTable = (
    <EditingModal buttonText="Add existing museum">
      <MuseumSelectingTable />
    </EditingModal>
  )

  return (
    <Grouped title="Museums">
      {mode === 'edit' && (
        <Box display="flex" gap={1}>
          {editingModal} {selectingTable}
        </Box>
      )}
      <EditableTable<Editable<Museum>, LocalityDetails>
        columns={columns}
        data={editData.museums}
        editable
        field="museums"
      />
    </Grouped>
  )
}
