import { Box, Button, Checkbox, IconButton, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material'
import { MRT_RowData, MRT_ShowHideColumnsButton, MRT_TableInstance } from 'material-react-table'
import { exportRows } from './helpers'
import { ContactForm } from '../DetailView/common/ContactForm'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ViewWeekIcon from '@mui/icons-material/ViewWeek'
import '../../styles/TableToolBar.css'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { CrossSearchExportMenuItem } from '../CrossSearch/CrossSearchExportMenuItem'
import { usePageContext } from '../Page'

export type ColumnVisibilityGroup = {
  id: string
  label: string
  columnIds: string[]
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
  const [groupAnchorEl, setGroupAnchorEl] = useState<null | HTMLElement>(null)
  const groupMenuOpen = Boolean(groupAnchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleGroupMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setGroupAnchorEl(event.currentTarget)
  }

  const handleGroupMenuClose = () => {
    setGroupAnchorEl(null)
  }

  const resolvedGroups = columnVisibilityGroups?.filter(group => group.columnIds.length > 0) ?? []

  const resolveGroupColumns = (group: ColumnVisibilityGroup) => {
    return group.columnIds
      .map(columnId => table.getColumn?.(columnId))
      .filter((column): column is NonNullable<typeof column> => Boolean(column))
      .filter(column => (typeof column.getCanHide === 'function' ? column.getCanHide() : true))
  }

  const getGroupVisibilityState = (group: ColumnVisibilityGroup) => {
    const columns = resolveGroupColumns(group)
    if (columns.length === 0) {
      return { checked: false, indeterminate: false }
    }

    const visibleCount = columns.reduce((acc, column) => acc + (column.getIsVisible?.() ? 1 : 0), 0)
    return {
      checked: visibleCount === columns.length,
      indeterminate: visibleCount > 0 && visibleCount < columns.length,
    }
  }

  const toggleGroup = (group: ColumnVisibilityGroup) => {
    const columns = resolveGroupColumns(group)
    if (columns.length === 0) return

    const { checked } = getGroupVisibilityState(group)
    const nextVisible = !checked
    columns.forEach(column => column.toggleVisibility?.(nextVisible))
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
        <MRT_ShowHideColumnsButton table={table} />
        {resolvedGroups.length > 0 && (
          <>
            <Tooltip title="Show/hide column groups">
              <IconButton
                id="column-groups-button"
                aria-label="Show/hide column groups"
                aria-controls={groupMenuOpen ? 'column-groups-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={groupMenuOpen ? 'true' : undefined}
                onClick={handleGroupMenuOpen}
              >
                <ViewWeekIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="column-groups-menu"
              anchorEl={groupAnchorEl}
              open={groupMenuOpen}
              onClose={handleGroupMenuClose}
              MenuListProps={{
                'aria-labelledby': 'column-groups-button',
              }}
            >
              {resolvedGroups.map(group => {
                const { checked, indeterminate } = getGroupVisibilityState(group)
                return (
                  <MenuItem
                    key={group.id}
                    onClick={() => {
                      toggleGroup(group)
                    }}
                  >
                    <Checkbox checked={checked} indeterminate={indeterminate} />
                    <ListItemText primary={group.label} />
                  </MenuItem>
                )
              })}
            </Menu>
          </>
        )}
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
