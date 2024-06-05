import { useGetAllReferencesQuery } from '../../redux/referenceReducer'
import { Reference } from '@/backendTypes'
import { TableView } from '../TableView/TableView'
import { referenceTableColumns } from '@/common'

export const ReferenceTable = ({ selectorFn }: { selectorFn?: (id: Reference) => void }) => {
  const referenceQuery = useGetAllReferencesQuery()

  const checkRowRestriction = () => {
    return false
  }

  return (
    <TableView<Reference>
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="rid"
      columns={referenceTableColumns}
      data={referenceQuery.data}
      url="reference"
    />
  )
}
