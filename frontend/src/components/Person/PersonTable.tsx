import { useGetAllPersonsQuery } from '../../redux/personReducer'
import { PersonDetailsType } from '@/shared/types'
import { TableView } from '../TableView/TableView'
import { personTableColumns } from '@/common'

export const PersonTable = ({ selectorFn }: { selectorFn?: (id: PersonDetailsType) => void }) => {
  const {
    data: personQueryData,
    isFetching,
    isError,
    error,
  } = useGetAllPersonsQuery()

  const visibleColumns = {
    iniitals: false,
  }

  return (
    <TableView<PersonDetailsType>
      title="People"
      selectorFn={selectorFn}
      idFieldName="initials"
      columns={personTableColumns}
      isFetching={isFetching}
      isError={isError}
      error={error}
      visibleColumns={visibleColumns}
      data={personQueryData}
      url="person"
    />
  )
}
