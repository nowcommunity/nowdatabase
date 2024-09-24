import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllProjectsQuery } from '../../redux/projectReducer'
import { Project } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

export const ProjectTable = ({ selectorFn }: { selectorFn?: (id: Project) => void }) => {
  const projectQuery = useGetAllProjectsQuery()
  const columns = useMemo<MRT_ColumnDef<Project>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'pid',
        header: 'Project Id',
      },
      {
        accessorKey: 'proj_code',
        header: 'Project Code',
      },
      {
        accessorKey: 'proj_name',
        header: 'Project Name',
      },
      {
        accessorKey: 'contact',
        header: 'Coordinator',
      },
      {
        accessorKey: 'proj_status',
        header: 'Project Status',
      },
      {
        accessorKey: 'proj_records',
        header: 'Record Status',
      },
    ],
    []
  )

  const visibleColumns = {
    id: false,
  }

  return (
    <TableView<Project>
      title="Projects"
      selectorFn={selectorFn}
      idFieldName="pid"
      columns={columns}
      visibleColumns={visibleColumns}
      data={projectQuery.data}
      url="project"
    />
  )
}
