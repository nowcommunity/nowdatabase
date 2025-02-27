import { useGetAllPersonsQuery } from '../../redux/personReducer'
import { PersonDetailsType } from '@/shared/types'
import { TableView } from '../TableView/TableView'
import { personTableColumns } from '@/common'

export const PersonTable = ({ selectorFn }: { selectorFn?: (id: PersonDetailsType) => void }) => {
  const personQuery = useGetAllPersonsQuery()

  const visibleColumns = {
    iniitals: false,
  }

  return (
    <TableView<PersonDetailsType>
      title="People"
      selectorFn={selectorFn}
      idFieldName="initials"
      columns={personTableColumns}
      visibleColumns={visibleColumns}
      data={personQuery.data}
      url="person"
    />
  )
}
