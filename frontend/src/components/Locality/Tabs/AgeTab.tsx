import { Locality } from '../../../redux/localityReducer'
import { LabeledItems } from '../../DetailView/LabeledItems'
import { DataValue, Grouped } from '../../DetailView/common/FormComponents'
import { useGetEditableTextField } from '../../DetailView/hooks'

export const AgeTab = () => {
  const getEditableTextField = useGetEditableTextField<Locality>()
  const labelFields: { label: string; field: keyof Locality }[] = [
    {
      label: 'Dating Method',
      field: 'date_meth',
    },
    {
      label: 'Minimum Age',
      field: 'min_age',
    },
    {
      label: 'Maximum Age',
      field: 'max_age',
    },
    {
      label: 'Chronostratigraphic Age',
      field: 'chron',
    },
    {
      label: 'Age Comment',
      field: 'age_comm',
    },
  ]
  const ageItems = labelFields.map(({ label, field }) => ({
    label,
    component: <DataValue<Locality> field={field as keyof Locality} editElement={getEditableTextField} />,
  }))

  return (
    <>
      <Grouped title="Age">
        <LabeledItems items={ageItems} />
      </Grouped>
    </>
  )
}
