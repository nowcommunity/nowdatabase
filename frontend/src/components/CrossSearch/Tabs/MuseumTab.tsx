import { Editable, LocalityDetailsType, Museum } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
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

  return (
    <Grouped title="Museums">
      {!mode.read && (
        <Box display="flex" gap={1}>
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
