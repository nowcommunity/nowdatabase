import { Box, Button, CircularProgress, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { MRT_RowData, MRT_ShowHideColumnsButton, MRT_TableInstance } from 'material-react-table'
import { exportRows } from './helpers'
import { ContactForm } from '../DetailView/common/ContactForm'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import '../../styles/TableToolBar.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { CrossSearchExportMenuItem } from '../CrossSearch/CrossSearchExportMenuItem'

export const TableToolBar = <T extends MRT_RowData>({
  table,
  combinedExport,
  kmlExport,
  exportIsLoading,
  isCrossSearchTable,
  selectorFn,
  showNewButton,
}: {
  table: MRT_TableInstance<T>
  combinedExport?: (lids: number[]) => Promise<void>
  kmlExport?: (table: MRT_TableInstance<T>) => void
  exportIsLoading?: boolean
  isCrossSearchTable?: boolean
  selectorFn?: (id: T) => void
  showNewButton?: boolean
}) => {
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
            <Button variant="outlined" component={Link} to="new" className="button" startIcon={<AddCircleIcon />}>
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
                exportRows(table)
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
          {combinedExport && (
            <Box>
              <Tooltip
                title={
                  <span style={{ fontSize: 18 }}>
                    Export&lsquo;s all localities filtered in the table below with all their species. The export is
                    sorted by name. This may take up to a minute, so please wait without closing the browser or
                    switching page. To export only localities use the &lsquo;Export table&lsquo; option above.
                  </span>
                }
              >
                <MenuItem
                  onClick={() => {
                    void combinedExport(table.getSortedRowModel().rows.map(d => d.original.lid as number))
                    handleClose()
                  }}
                  disabled={exportIsLoading}
                >
                  Export localities with their species
                </MenuItem>
              </Tooltip>
              {exportIsLoading && <CircularProgress />}
            </Box>
          )}
        </Menu>
      </Box>
    </div>
  )
}
