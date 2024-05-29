import { LocalityDetailsType } from '@/backendTypes'
import { ArrayFrame } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const EcometricsTab = () => {
  const { textField } = useDetailContext<LocalityDetailsType>()

  const ecometrics = [
    ['Estimate of annual precipitation (mm)', textField('estimate_precip')],
    ['Estimate of mean annual temperature (°C)', textField('estimate_temp')],
    ['Estimate of net primary productivity (g/m2/yr)', textField('estimate_npp')],
    ['Woody cover percentage', textField('pers_woody_cover')],
  ]

  return (
    <>
      <ArrayFrame array={ecometrics} title="Ecometrics" />
    </>
  )
}
