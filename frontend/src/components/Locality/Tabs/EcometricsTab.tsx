import { LocalityDetailsType } from '@/backendTypes'
import { ArrayFrame } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const EcometricsTab = () => {
  const { textField, data } = useDetailContext<LocalityDetailsType>()

  // Mean hypsodonty calculation has been made based on html/include/database.php line 2567 onwards

  const relevantOrderNames = [
    'Perissodactyla',
    'Artiodactyla',
    'Primates',
    'Proboscidea',
    'Hyracoidea',
    'Dinocerata',
    'Embrithopoda',
    'Notoungulata',
    'Astrapotheria',
    'Pyrotheria',
    'Litopterna',
    'Condylarthra',
    'Pantodonta',
  ]

  const thtToValue = {
    bra: 1.0,
    mes: 2.0,
    hyp: 3.0,
    hys: 3.0,
    none: 0.0,
  } as Record<string, number>

  const species = data.now_ls
    .map(ls => ls.com_species)
    .filter(species => relevantOrderNames.includes(species.order_name))
    .map(species => thtToValue[species.tht ?? 'none'])
  const sum = species.reduce((sum, cur) => sum + cur, 0.0)
  const meanHypsodonty = species.length > 0 ? sum / (species.length * 1.0) : 0.0
  const roundedMean = parseFloat((Math.floor(meanHypsodonty * 100) / 100).toFixed(2))

  const ecometrics = [
    ['Mean hypsodonty', roundedMean],
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
