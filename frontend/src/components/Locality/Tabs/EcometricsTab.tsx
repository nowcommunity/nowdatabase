import { LocalityDetailsType } from '@/shared/types'
import { ArrayFrame } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { calculateMeanHypsodonty } from '@/shared/calculations'

export const EcometricsTab = () => {
  const { textField, data } = useDetailContext<LocalityDetailsType>()

  const ecometrics = [
    ['Mean hypsodonty', calculateMeanHypsodonty(data)],
    [
      'Estimate of annual precipitation (mm)',
      textField('estimate_precip', { type: 'number', integerOnly: true, min: 0 }),
    ],
    ['Estimate of mean annual temperature (°C)', textField('estimate_temp', { type: 'number' })],
    [
      'Estimate of net primary productivity (g/m2/yr)',
      textField('estimate_npp', { type: 'number', integerOnly: true, min: 0 }),
    ],
    ['Woody cover percentage', textField('pers_woody_cover', { type: 'number', integerOnly: true, min: 0, max: 100 })],
  ]

  return (
    <>
      <ArrayFrame array={ecometrics} title="Ecometrics" />
    </>
  )
}
