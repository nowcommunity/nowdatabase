import { Editable, LocalityDetailsType, Project } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllProjectsQuery } from '@/redux/projectReducer'
import { Box } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { skipToken } from '@reduxjs/toolkit/query'

export const ProjectTab = () => {
  const { mode, editData, setEditData } = useDetailContext<LocalityDetailsType>()
  const { data: projectData, isError } = useGetAllProjectsQuery(mode.read ? skipToken : undefined)

  const columns: MRT_ColumnDef<Project>[] = [
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
    // TODO
    /* {
      accessorFn: ({ proj_records }) => (proj_records ? 'Public' : 'Private'),
      header: 'Records',
    }, */
  ]

  return (
    <Grouped title="Projects">
      {!mode.read && (
        <Box display="flex" gap={1}>
          <SelectingTable<Project, LocalityDetailsType>
            buttonText="Select Project"
            data={projectData}
            columns={columns}
            isError={isError}
            idFieldName="pid"
            fieldName="now_plr"
            editingAction={(newProject: Project) => {
              setEditData({
                ...editData,
                now_plr: [
                  ...editData.now_plr,
                  { lid: editData.lid, pid: newProject.pid, now_proj: newProject, rowState: 'new' },
                ],
              })
            }}
          />
        </Box>
      )}
      <EditableTable<Editable<Project>, LocalityDetailsType>
        columns={columns.map(c => ({ ...c, accessorKey: `now_proj.${c.accessorKey}` }))}
        field="now_plr"
      />
    </Grouped>
  )
}
