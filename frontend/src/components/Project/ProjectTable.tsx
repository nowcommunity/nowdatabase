import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllProjectsQuery } from '../../redux/projectReducer'
import { Project } from '@/shared/types'
import { TableView } from '../TableView/TableView'

export const ProjectTable = ({ selectorFn }: { selectorFn?: (id: Project) => void }) => {
  const { data: projectQueryData, isFetching } = useGetAllProjectsQuery()
  const columns = useMemo<MRT_ColumnDef<Project>[]>(
    () => [
      {
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
    pid: false,
  }

  return (
    <TableView<Project>
      title="Projects"
      selectorFn={selectorFn}
      idFieldName="pid"
      columns={columns}
      isFetching={isFetching}
      visibleColumns={visibleColumns}
      data={projectQueryData}
      url="project"
    />
  )
}
