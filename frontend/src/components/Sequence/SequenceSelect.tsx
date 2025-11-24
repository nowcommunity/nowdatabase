import { FieldWithTableSelection } from '@/components/DetailView/common/editingComponents'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SequenceDetailsType, TimeUnitDetailsType } from '@/shared/types'
import { SequenceTable } from './SequenceTable'

export const SequenceSelect = () => {
  const { data } = useDetailContext<TimeUnitDetailsType>()

  const displayValue = data.now_tu_sequence?.seq_name ?? ''

  return (
    <FieldWithTableSelection<SequenceDetailsType & { display_value?: string }, TimeUnitDetailsType>
      key="sequence"
      sourceField="sequence"
      targetField="sequence"
      selectorTable={<SequenceTable />}
      displayValue={displayValue}
      getDisplayValue={sequence => sequence.display_value ?? sequence.seq_name ?? ''}
    />
  )
}
