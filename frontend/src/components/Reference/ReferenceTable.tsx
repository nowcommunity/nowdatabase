import { useGetAllReferencesQuery } from '../../redux/referenceReducer'
import { Reference } from '@/backendTypes'
import { TableView } from '../TableView/TableView'
import { referenceTableColumns } from '@/common'

export const ReferenceTable = ({ selectorFn }: { selectorFn?: (id: Reference) => void }) => {
  const referenceQuery = useGetAllReferencesQuery()

  const hiddenColumns = {
    id: false,
  }

  return (
    <TableView<Reference>
      title="References"
      selectorFn={selectorFn}
      idFieldName="rid"
      columns={referenceTableColumns}
      hiddenColumns={hiddenColumns}
      data={referenceQuery.data}
      url="reference"
    />
  )
}
