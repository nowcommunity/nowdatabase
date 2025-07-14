import { CircularProgress } from '@mui/material'
import {
  type MRT_ColumnDef,
  type MRT_RowData,
  type MRT_PaginationState,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table'
import { useDetailContext } from '../Context/DetailContext'
import { ActionComponent } from '@/components/TableView/ActionComponent'
import { defaultPaginationSmall } from './defaultValues'
import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { usePageContext } from '@/components/Page'

export const SimpleTable = <T extends MRT_RowData, ParentType extends MRT_RowData>({
  data,
  columns,
  idFieldName,
  url,
}: {
  data?: Array<T> | null
  columns: MRT_ColumnDef<T>[]
  idFieldName?: keyof T
  url?: string
}) => {
  const { mode } = useDetailContext<ParentType>()
  const [pagination, setPagination] = useState<MRT_PaginationState>(defaultPaginationSmall)
  const navigate = useNavigate()

  const location = useLocation()
  const { setTableUrl } = usePageContext()
  const [searchParams] = useSearchParams()

  const linkToDetails = ({ row }: { row: MRT_Row<T> }) => {
    if (mode.read && idFieldName && url) return <ActionComponent {...{ row, idFieldName, url }} />
    return null // code shouldn't get here!
  }

  const actionRowProps =
    mode.read && idFieldName && url
      ? {
          enableRowActions: true,
          renderRowActions: linkToDetails,
          muiTableBodyRowProps: ({ row }: { row: MRT_Row<T> }) => ({
            onClick: () => {
              setTableUrl(`${location.pathname}?tab=${searchParams.get('tab')}`)
              navigate(`/${url}/${row.original[idFieldName]}`)
            },
            sx: {
              cursor: 'pointer',
            },
          }),
        }
      : {}

  const table = useMaterialReactTable({
    columns: columns,
    data: data || [],
    enableTopToolbar: false,
    enableColumnActions: false,
    positionPagination: 'bottom',
    onPaginationChange: setPagination,
    paginationDisplayMode: 'pages',
    state: { density: 'compact', pagination },
    ...actionRowProps,
  })

  if (!data) return <CircularProgress />

  return <MaterialReactTable table={table} />
}
