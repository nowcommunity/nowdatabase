import { LocalityDetailsType } from '@/backendTypes'
import { ArrayFrame } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const EcometricsTab = () => {
  const { textField } = useDetailContext<LocalityDetailsType>()

  const ecometrics = [
    ['Mean hypsodonty', 'Not yet implemented'],
    ['Estimate of annual precipitation (mm)', textField('estimate_precip', 'number')],
    ['Estimate of mean annual temperature (°C)', textField('estimate_temp', 'number')],
    ['Estimate of net primary productivity (g/m2/yr)', textField('estimate_npp', 'number')],
    ['Woody cover percentage', textField('pers_woody_cover', 'number')],
  ]

  return (
    <>
      <ArrayFrame array={ecometrics} title="Ecometrics" />
    </>
  )
}
