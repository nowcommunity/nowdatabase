import { useMemo, useState } from 'react'
import { Alert, Box } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { skipToken } from '@reduxjs/toolkit/query'

import { Editable, LocalityDetailsType, Project } from '@/shared/types'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllProjectsQuery } from '@/redux/projectReducer'
import { usePageContext } from '@/components/Page'

export const ProjectTab = () => {
  const { mode, editData, setEditData } = useDetailContext<LocalityDetailsType>()
  const { editRights } = usePageContext<LocalityDetailsType>()
  const canModifyProjects = !mode.read && Boolean(editRights.edit || editRights.new)
  const { data: projectData, isError } = useGetAllProjectsQuery(canModifyProjects ? undefined : skipToken)
  const [selectionError, setSelectionError] = useState<string | null>(null)

  const activeProjectIds = useMemo(() => {
    return new Set((editData.now_plr ?? []).filter(link => link.rowState !== 'removed').map(link => link.pid))
  }, [editData.now_plr])

  const handleProjectSelect = (newProject: Project) => {
    if (activeProjectIds.has(newProject.pid)) {
      setSelectionError('Project is already linked to this locality.')
      return
    }
    setSelectionError(null)
    setEditData({
      ...editData,
      now_plr: [
        ...(editData.now_plr ?? []),
        { lid: editData.lid, pid: newProject.pid, now_proj: newProject, rowState: 'new' },
      ],
    })
  }

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
      {selectionError && (
        <Alert severity="warning" data-testid="project-selection-error">
          {selectionError}
        </Alert>
      )}
      {canModifyProjects && (
        <Box display="flex" gap={1}>
          <SelectingTable<Project, LocalityDetailsType>
            buttonText="Select Project"
            data={projectData}
            title="Projects"
            columns={columns}
            isError={Boolean(isError)}
            idFieldName="pid"
            fieldName="now_plr"
            editingAction={handleProjectSelect}
          />
        </Box>
      )}
      {isError && <Alert severity="error">Unable to fetch projects. Please try again later.</Alert>}
      <EditableTable<Editable<Project>, LocalityDetailsType>
        columns={columns.map(c => ({ ...c, accessorKey: `now_proj.${c.accessorKey}` }))}
        field="now_plr"
        idFieldName="pid"
        url="project"
      />
    </Grouped>
  )
}
