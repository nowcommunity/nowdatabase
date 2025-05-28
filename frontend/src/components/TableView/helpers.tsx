import { MRT_RowData, MRT_TableInstance } from 'material-react-table'
import { mkConfig, generateCsv, download } from 'export-to-csv'
import { AcceptedData } from 'node_modules/export-to-csv/output/lib/types'

export type ExportFn<T> = (data: T) => { [k: string]: AcceptedData }

export const exportRows = <T extends MRT_RowData>(table: MRT_TableInstance<T>) => {
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    quoteStrings: true, // If true, will wrap all values in double quotes
  })
  const rowData = table.getPrePaginationRowModel().rows.map(row => {
    const r = {} as Record<string, AcceptedData>
    row.getVisibleCells().map(cell => {
      const columnHeader = table.getColumn(cell.column.id).columnDef.header
      let value = cell.getValue() as AcceptedData
      if (typeof value === 'string') {
        value = value.replace(/[\r\n]+/g, ' ') // Replace line feeds with spaces
      }
      //      const value = cell.getValue() as AcceptedData
      // Action row has no header; skipping it. Will cause trouble if some actual column's header is empty
      if (columnHeader !== '') r[columnHeader] = value !== null ? value : ''
    })
    return r
  })
  const csv = generateCsv(csvConfig)(rowData)
  download(csvConfig)(csv)
}
