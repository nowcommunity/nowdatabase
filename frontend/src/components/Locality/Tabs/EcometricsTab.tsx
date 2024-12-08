import { LocalityDetailsType } from '@/shared/types'
import { ArrayFrame } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { calculateMeanHypsodonty } from '@/shared/calculations'

export const EcometricsTab = () => {
  const { textField, data } = useDetailContext<LocalityDetailsType>()

  const ecometrics = [
    ['Mean hypsodonty', calculateMeanHypsodonty(data)],
    ['Estimate of annual precipitation (mm)', textField('estimate_precip', { type: 'number' })],
    ['Estimate of mean annual temperature (°C)', textField('estimate_temp', { type: 'number' })],
    ['Estimate of net primary productivity (g/m2/yr)', textField('estimate_npp', { type: 'number' })],
    ['Woody cover percentage', textField('pers_woody_cover', { type: 'number' })],
  ]

  return (
    <>
      <ArrayFrame array={ecometrics} title="Ecometrics" />
    </>
  )
}
