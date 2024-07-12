import { Editable, LocalityDetailsType, Museum } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllMuseumsQuery } from '@/redux/museumReducer'
import { Box } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { skipToken } from '@reduxjs/toolkit/query'

export const MuseumTab = () => {
  const { mode, editData, setEditData } = useDetailContext<LocalityDetailsType>()
  const { data: museumData, isError } = useGetAllMuseumsQuery(mode.read ? skipToken : undefined)

  const columns: MRT_ColumnDef<Museum>[] = [
    {
      accessorKey: 'museum',
      header: 'Museum code',
    },
    {
      accessorKey: 'institution',
      header: 'Institution',
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
    { name: 'museum', label: 'Museum', required: true },
    { name: 'institution', label: 'Institution' },
    { name: 'alternativeName', label: 'Alternative name' },
    { name: 'city', label: 'City', required: true },
    { name: 'state', label: 'State' },
    { name: 'stateCode', label: 'State code' },
    { name: 'country', label: 'Country', required: true },
  ]

  return (
    <Grouped title="Museums">
      {!mode.read && (
        <Box display="flex" gap={1}>
          <EditingForm<Museum, LocalityDetailsType>
            buttonText="Add new museum"
            formFields={formFields}
            editAction={(newMuseum: Museum) => {
              setEditData({
                ...editData,
                now_mus: [
                  ...editData.now_mus,
                  { lid: editData.lid, museum: newMuseum.museum, com_mlist: newMuseum, rowState: 'new' },
                ],
              })
            }}
          />
          <SelectingTable<Museum, LocalityDetailsType>
            buttonText="Select Museum"
            data={museumData}
            isError={isError}
            columns={columns}
            fieldName="now_mus"
            idFieldName="museum"
            editingAction={(newMuseum: Museum) => {
              setEditData({
                ...editData,
                now_mus: [
                  ...editData.now_mus,
                  { lid: editData.lid, museum: newMuseum.museum, com_mlist: newMuseum, rowState: 'new' },
                ],
              })
            }}
          />
        </Box>
      )}
      <EditableTable<Editable<Museum>, LocalityDetailsType>
        columns={columns.map(col => ({ ...col, accessorKey: `com_mlist.${col.accessorKey}` }))}
        field="now_mus"
      />
    </Grouped>
  )
}
