import { TextField } from '@mui/material'
import { Locality } from '../../../redux/localityReducer'
import { LabeledItem, LabeledItems } from '../../DetailView/LabeledItems'
import { DataValue, Grouped } from '../../DetailView/DetailView'
import { useDetailContext, useGetEditableTextField } from '../../DetailView/hooks'

export const AgeTab = () => {
  const { data: locality } = useDetailContext<Locality>()
  const getEditableTextField = useGetEditableTextField<Locality>()
  const ageItems: LabeledItem[] = [
    {
      label: 'Dating Method',
      display: locality.date_meth,
      editable: <DataValue<Locality> field="date_meth" editElement={getEditableTextField} />,
    },
    {
      label: 'Minimum Age',
      display: locality.min_age,
      editable: <TextField variant="standard" />,
    },
    {
      label: 'Maximum Age',
      display: locality.max_age,
      editable: <TextField variant="standard" />,
    },
    {
      label: 'Chronostratigraphic Age',
      display: locality.chron,
      editable: <TextField variant="standard" />,
    },
    {
      label: 'Age Comment',
      display: locality.max_age,
      editable: <TextField variant="standard" />,
    },
  ]

  return (
    <>
      <Grouped title="Age">
        <LabeledItems items={ageItems} />
      </Grouped>
    </>
  )
}
