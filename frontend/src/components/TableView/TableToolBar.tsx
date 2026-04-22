import { Box, Button, Checkbox, IconButton, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material'
import { MRT_RowData, MRT_TableInstance } from 'material-react-table'
import { exportRows } from './helpers'
import { ContactForm } from '../DetailView/common/ContactForm'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import '../../styles/TableToolBar.css'
import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { CrossSearchExportMenuItem } from '../CrossSearch/CrossSearchExportMenuItem'
import { usePageContext } from '../Page'

export type ColumnVisibilityGroup = {
  id: string
  label: string
  columnIds: string[]
}

type ResolvedColumnVisibilityGroup = {
  id: string
  label: string
  columns: Array<{
    id: string
    header: ReactNode
    isVisible: boolean
    toggleVisibility: (value?: boolean) => void
  }>
}

export const TableToolBar = <T extends MRT_RowData>({
  table,
  tableName,
  kmlExport,
  svgExport,
  isCrossSearchTable,
  selectorFn,
  showNewButton,
  hideLeftButtons,
  columnVisibilityGroups,
}: {
  table: MRT_TableInstance<T>
  tableName: string
  kmlExport?: (table: MRT_TableInstance<T>) => void
  svgExport?: (table: MRT_TableInstance<T>) => void
  isCrossSearchTable?: boolean
  selectorFn?: (id: T) => void
  showNewButton?: boolean
  hideLeftButtons?: boolean
  columnVisibilityGroups?: ColumnVisibilityGroup[]
}) => {
  const { previousTableUrls, setPreviousTableUrls } = usePageContext<T>()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [columnAnchorEl, setColumnAnchorEl] = useState<null | HTMLElement>(null)
  const columnMenuOpen = Boolean(columnAnchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColumnAnchorEl(event.currentTarget)
  }

  const handleColumnMenuClose = () => {
    setColumnAnchorEl(null)
  }

  const resolveColumn = (columnId: string) => {
    const fromApi = table.getColumn?.(columnId)
    if (fromApi) return fromApi

    const allLeafColumns = table.getAllLeafColumns?.()
    return allLeafColumns?.find(column => column.id === columnId)
  }

  const isHideableColumn = (column: unknown): boolean => {
    const canHide = (column as { getCanHide?: () => boolean } | null | undefined)?.getCanHide
    return typeof canHide === 'function' ? canHide() : true
  }

  const resolvedGroups: ResolvedColumnVisibilityGroup[] = (() => {
    const groups = (columnVisibilityGroups ?? [])
      .filter(group => group.columnIds.length > 0)
      .filter(group => !/^updates$/i.test(group.label) && !/^updates$/i.test(group.id))

    const resolved = groups
      .map(group => {
        const columns = group.columnIds
          .map(columnId => resolveColumn(columnId))
          .filter((column): column is NonNullable<typeof column> => Boolean(column))
          .filter(isHideableColumn)
          .map(column => ({
            id: column.id,
            header: (column.columnDef?.header ?? column.id) as ReactNode,
            isVisible: column.getIsVisible?.() ?? true,
            toggleVisibility: (value?: boolean) => column.toggleVisibility?.(value),
          }))

        return { id: group.id, label: group.label, columns }
      })
      .filter(group => group.columns.length > 0)

    const groupedColumnIds = new Set(resolved.flatMap(group => group.columns.map(column => column.id)))
    const otherColumns =
      table
        .getAllLeafColumns?.()
        ?.filter(isHideableColumn)
        ?.filter(column => !groupedColumnIds.has(column.id))
        ?.map(column => ({
          id: column.id,
          header: (column.columnDef?.header ?? column.id) as ReactNode,
          isVisible: column.getIsVisible?.() ?? true,
          toggleVisibility: (value?: boolean) => column.toggleVisibility?.(value),
        })) ?? []

    if (otherColumns.length > 0) {
      return [...resolved, { id: 'other', label: 'Other', columns: otherColumns }]
    }

    return resolved
  })()

  const resolvedAllColumns =
    table
      .getAllLeafColumns?.()
      ?.filter(isHideableColumn)
      ?.map(column => ({
        id: column.id,
        header: (column.columnDef?.header ?? column.id) as ReactNode,
        isVisible: column.getIsVisible?.() ?? true,
        toggleVisibility: (value?: boolean) => column.toggleVisibility?.(value),
      })) ?? []

  const getAllVisibilityState = () => {
    if (resolvedAllColumns.length === 0) {
      return { checked: false, indeterminate: false }
    }

    const visibleCount = resolvedAllColumns.reduce((acc, column) => acc + (column.isVisible ? 1 : 0), 0)
    return {
      checked: visibleCount === resolvedAllColumns.length,
      indeterminate: visibleCount > 0 && visibleCount < resolvedAllColumns.length,
    }
  }

  const toggleAll = () => {
    if (resolvedAllColumns.length === 0) return
    const { checked } = getAllVisibilityState()
    const nextVisible = !checked
    resolvedAllColumns.forEach(column => column.toggleVisibility(nextVisible))
  }

  const getGroupVisibilityState = (group: ResolvedColumnVisibilityGroup) => {
    if (group.columns.length === 0) {
      return { checked: false, indeterminate: false }
    }

    const visibleCount = group.columns.reduce((acc, column) => acc + (column.isVisible ? 1 : 0), 0)
    return {
      checked: visibleCount === group.columns.length,
      indeterminate: visibleCount > 0 && visibleCount < group.columns.length,
    }
  }

  const toggleGroup = (group: ResolvedColumnVisibilityGroup) => {
    if (group.columns.length === 0) return

    const { checked } = getGroupVisibilityState(group)
    const nextVisible = !checked
    group.columns.forEach(column => column.toggleVisibility(nextVisible))
  }

  const toggleColumn = (columnId: string) => {
    const column = resolveColumn(columnId)
    if (!column || !isHideableColumn(column)) return
    column.toggleVisibility?.(!column.getIsVisible?.())
  }

  return (
    <div className="table-tool-bar">
      {!selectorFn && !hideLeftButtons && (
        <Box className="left-buttons">
          <ContactForm<T> buttonText="Contact" noContext={true} />

          {showNewButton && (
            <Button
              variant="outlined"
              component={Link}
              to="new"
              className="button"
              startIcon={<AddCircleIcon />}
              onClick={() => setPreviousTableUrls([...previousTableUrls, `${location.pathname}`])}
            >
              New
            </Button>
          )}
        </Box>
      )}
      <Box className="icon-buttons">
        <Tooltip title="Show/hide columns">
          <IconButton
            id="column-visibility-button"
            aria-label="Show/hide columns"
            aria-controls={columnMenuOpen ? 'column-visibility-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={columnMenuOpen ? 'true' : undefined}
            onClick={handleColumnMenuOpen}
          >
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="column-visibility-menu"
          anchorEl={columnAnchorEl}
          open={columnMenuOpen}
          onClose={handleColumnMenuClose}
          MenuListProps={{
            'aria-labelledby': 'column-visibility-button',
          }}
        >
          {resolvedAllColumns.length > 0 && (
            <MenuItem
              key="all-columns"
              onClick={() => {
                toggleAll()
              }}
            >
              {(() => {
                const { checked, indeterminate } = getAllVisibilityState()
                return <Checkbox checked={checked} indeterminate={indeterminate} />
              })()}
              <ListItemText primary="All" />
            </MenuItem>
          )}
          {resolvedGroups.flatMap(group => {
            const { checked, indeterminate } = getGroupVisibilityState(group)
            return [
              <MenuItem
                key={`group:${group.id}`}
                onClick={() => {
                  toggleGroup(group)
                }}
              >
                <Checkbox checked={checked} indeterminate={indeterminate} />
                <ListItemText primary={group.label} />
              </MenuItem>,
              ...group.columns.map(column => (
                <MenuItem
                  key={`column:${group.id}:${column.id}`}
                  sx={{ pl: 4 }}
                  onClick={() => {
                    toggleColumn(column.id)
                  }}
                >
                  <Checkbox checked={column.isVisible} />
                  <ListItemText primary={column.header ?? column.id} />
                </MenuItem>
              )),
            ]
          })}
        </Menu>
        <Tooltip title="Export table (hide columns to exclude them)">
          <IconButton
            id="export-button"
            aria-controls={open ? 'export-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="export-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'export-button',
          }}
        >
          {isCrossSearchTable ? (
            <CrossSearchExportMenuItem handleClose={handleClose} />
          ) : (
            <MenuItem
              onClick={() => {
                exportRows(table, tableName)
                handleClose()
              }}
            >
              Export table
            </MenuItem>
          )}

          {kmlExport && (
            <MenuItem
              onClick={() => {
                kmlExport(table)
                handleClose()
              }}
            >
              Export KML
            </MenuItem>
          )}

          {svgExport && (
            <MenuItem
              onClick={() => {
                svgExport(table)
                handleClose()
              }}
            >
              Export SVG map
            </MenuItem>
          )}
        </Menu>
      </Box>
    </div>
  )
}
