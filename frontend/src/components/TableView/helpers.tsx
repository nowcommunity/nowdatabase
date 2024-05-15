import { Box, IconButton } from '@mui/material'
import {
  MRT_Row,
  MRT_RowData,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_ToggleFullScreenButton,
} from 'material-react-table'
import { mkConfig, generateCsv, download } from 'export-to-csv'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

const exportRows = <T extends MRT_RowData>(rows: MRT_Row<T>[]) => {
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  })
  const rowData = rows.map(row => row.original)
  const csv = generateCsv(csvConfig)(rowData)
  download(csvConfig)(csv)
}

export const renderCustomToolbarModalVersion = <T extends MRT_RowData>({ table }: { table: MRT_TableInstance<T> }) => (
  <Box>
    <MRT_ShowHideColumnsButton table={table} />
  </Box>
)

export const renderCustomToolbar = <T extends MRT_RowData>({ table }: { table: MRT_TableInstance<T> }) => (
  <Box>
    <MRT_ShowHideColumnsButton table={table} />
    <MRT_ToggleFullScreenButton table={table} />
    <IconButton onClick={() => exportRows(table.getPrePaginationRowModel().rows)}>
      <FileDownloadIcon htmlColor="grey" />
    </IconButton>
  </Box>
)
