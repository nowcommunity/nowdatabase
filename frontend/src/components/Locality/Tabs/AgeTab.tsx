import { Grouped } from '../LocalityDetails'
import { TextField } from '@mui/material'
import { Locality } from '../../../redux/localityReducer'
import { useDetailContext } from './Context/hook'
import { LabeledItem, LabeledItems } from './LabeledItems'
import { DataValue } from '../../DetailView'

export const AgeTab = () => {
  const { data: locality } = useDetailContext<Locality>()
  const ageItems: LabeledItem[] = [
    {
      label: 'Dating Method',
      display: locality.date_meth,
      editable: <DataValue<Locality> field="date_meth" element={<div></div>} />,
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
