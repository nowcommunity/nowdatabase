import { Box } from '@mui/material'
import { SpeciesDetails } from '@/backendTypes'
import { ArrayFrame, DataValue } from '@components/DetailView/common/FormComponents'
import { useGetMultiSelection } from '@components/DetailView/hooks'

export const LocomotionTab = () => {
  const getMultiSelection = useGetMultiSelection<SpeciesDetails>()

  const multiSelection = (field: keyof SpeciesDetails, options: string[], name: string) => (
    <DataValue<SpeciesDetails> field={field as keyof SpeciesDetails} EditElement={getMultiSelection({ fieldName: field, options, name })} />
  )

  const feedingHabitat1Options = ['', 'ae', 'aq', 'sa', 'te']

  const feedingHabitat2Options = ['', 'aerial', 'aquatic', 'arb/surf',
    'canopy', 'caves', 'surface', 'u_ground']

  const shelterHabitat1Options = ['', 'ae', 'aq', 'sa', 'te']

  const shelterHabitat2Options = ['', 'aquatic', 'arb/surf',
    'canopy', 'caves', 'surface', 'u_ground']

  const locomotion1Options = ['', 'ae', 'aq', 'sa', 'te']

  const locomotion2Options = ['', 'aerial', 'arboreal', 'fossorial', 'npow_flight',
    'pow_flight', 'scansorial', 'semi-fossorial', 'surficial']

  const locomotion3Options = ['', 'arb_above_br', 'arb_suspensory', 'bipedal_str',
    'cursorial', 'fast_flight', 'gen_quad', 'glide', 'graviportal', 'hover', 'k_walk',
    'parachute', 'saltatory', 's/f_flight', 'slow_flight', 'soar', 'undulate',
    'sub_curs', 'hyper_curs', 'swim_parax'
  ]

  const activityOptions = ['', 'crepuscular', 'diurnal', 'nocturnal']

  const feedingHabitat = [
    ['Feeding Habitat 1', multiSelection('feedinghab1', feedingHabitat1Options, 'Feeding Habitat 1')],
    ['Feeding Habitat 2', multiSelection('feedinghab2', feedingHabitat2Options, 'Feeding Habitat 2')],
  ]

  const shelterHabitat = [
    ['Shelter Habitat 1', multiSelection('shelterhab1', shelterHabitat1Options, 'Shelter Habitat 1')],
    ['Shelter Habitat 2', multiSelection('shelterhab2', shelterHabitat2Options, 'Shelter Habitat 2')],
  ]

  const locomotion = [
    ['Locomotion 1', multiSelection('locomo1', locomotion1Options, 'Locomotion 1')],
    ['Locomotion 2', multiSelection('locomo2', locomotion2Options, 'Locomotion 2')],
    ['Locomotion 3', multiSelection('locomo3', locomotion3Options, 'Locomotion 3')],
    ['Activity', multiSelection('activity', activityOptions, 'Activity')],
  ]

  return (
    <Box>
      <ArrayFrame array={feedingHabitat} title="Feeding Habitat" />
      <ArrayFrame array={shelterHabitat} title="Shelter Habitat" />
      <ArrayFrame array={locomotion} title="Locomotion" />
    </Box>
  )
}
