import { useGetAllReferencesQuery } from '../../redux/referenceReducer'
import { Reference } from '@/shared/types'
import { TableView } from '../TableView/TableView'
import { referenceTableColumns } from '@/common'

export const ReferenceTable = ({ selectorFn }: { selectorFn?: (id: Reference) => void }) => {
  const {
    data: referenceQueryData,
    isFetching,
    isError,
    error,
  } = useGetAllReferencesQuery()
  let fixedNullDateData = undefined
  if (referenceQueryData) {
    // remove references with null date_primary values to not break the year filter,
    // this needs to be changed later if having null dates is a desired feature
    fixedNullDateData = referenceQueryData.map(ref => (ref.date_primary === null ? { ...ref, date_primary: 0 } : ref))
  }

  const visibleColumns = {
    id: false,
  }

  return (
    <TableView<Reference>
      title="References"
      selectorFn={selectorFn}
      idFieldName="rid"
      columns={referenceTableColumns}
      visibleColumns={visibleColumns}
      data={fixedNullDateData}
      url="reference"
      isFetching={isFetching}
      isError={isError}
      error={error}
    />
  )
}
