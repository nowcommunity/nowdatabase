import { Box } from '@mui/material'
import { LocalityDetails } from '@/backendTypes'
import { ArrayFrame } from '../../DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'

export const EcometricsTab = () => {
  const { textField } = useDetailContext<LocalityDetails>()

  const ecometrics = [
    ['Estimate of annual precipitation (mm)', textField('estimate_precip')],
    ['Estimate of mean annual temperature (°C)', textField('estimate_temp')],
    ['Estimate of net primary productivity (g/m2/yr)', textField('estimate_npp')],
    ['Woody cover percentage', textField('pers_woody_cover')],
  ]

  return (
    <Box>
      <ArrayFrame array={ecometrics} title="Ecometrics" />
    </Box>
  )
}
