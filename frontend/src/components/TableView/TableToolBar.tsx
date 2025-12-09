import { Box, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { MRT_RowData, MRT_ShowHideColumnsButton, MRT_TableInstance } from 'material-react-table'
import { exportRows } from './helpers'
import { ContactForm } from '../DetailView/common/ContactForm'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import '../../styles/TableToolBar.css'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { CrossSearchExportMenuItem } from '../CrossSearch/CrossSearchExportMenuItem'
import { usePageContext } from '../Page'

export const TableToolBar = <T extends MRT_RowData>({
  table,
  tableName,
  kmlExport,
  svgExport,
  isCrossSearchTable,
  selectorFn,
  showNewButton,
}: {
  table: MRT_TableInstance<T>
  tableName: string
  kmlExport?: (table: MRT_TableInstance<T>) => void
  svgExport?: (table: MRT_TableInstance<T>) => void
  isCrossSearchTable?: boolean
  selectorFn?: (id: T) => void
  showNewButton?: boolean
}) => {
  const { previousTableUrls, setPreviousTableUrls } = usePageContext<T>()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className="table-tool-bar">
      {!selectorFn && (
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
        <Tooltip title="Export">
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
