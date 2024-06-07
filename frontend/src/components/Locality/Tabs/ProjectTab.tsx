import { Editable, LocalityDetailsType, LocalityProject } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'

export const ProjectTab = () => {
  const { mode } = useDetailContext<LocalityDetailsType>()
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

  return (
    <Grouped title="Projects">
      {!mode.read && editingModal}
      <EditableTable<Editable<LocalityProject>, LocalityDetailsType> columns={columns} field="now_plr" />
    </Grouped>
  )
}
