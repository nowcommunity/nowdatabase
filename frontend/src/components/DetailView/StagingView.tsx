import { ArrayFrame, Grouped } from './common/tabLayoutHelpers'
import { useDetailContext } from './Context/DetailContext'
import { SelectingTable } from './common/SelectingTable'
import { useGetAllReferencesQuery } from '@/redux/referenceReducer'
import { referenceTableColumns } from '@/common'
import { MRT_RowData } from 'material-react-table'
import { Editable, Reference } from '@/backendTypes'
import { EditableTable } from './common/EditableTable'

export const StagingView = <T extends MRT_RowData>() => {
  const { bigTextField } = useDetailContext<T>()
  const { data, isError } = useGetAllReferencesQuery()

  const editInfoArray = [
    ['Date', new Date().toLocaleDateString('en-CA')],
    ['Editor', 'Users Name'],
    ['Coordinator', 'Indre Zliobaite'],
    ['Comment', bigTextField('update_comment')],
  ]

  return (
    <>
      <ArrayFrame array={editInfoArray} title="Reference for the new data" />
      <Grouped title="Reference">
        <SelectingTable<Reference, T>
          buttonText="Add existing reference"
          data={data}
          isError={isError}
          columns={referenceTableColumns}
          idFieldName="rid"
          fieldName="references"
        />
        <EditableTable<Editable<Reference>, T> columns={referenceTableColumns} field="references" />
      </Grouped>
    </>
  )
}
