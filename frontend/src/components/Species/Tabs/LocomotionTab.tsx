import { SpeciesDetailsType } from '@/backendTypes'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { emptyOption } from '@/components/DetailView/common/misc'

export const LocomotionTab = () => {
  const { dropdown } = useDetailContext<SpeciesDetailsType>()

  const feedingHabitat1Options = [
    emptyOption,
    { display: 'Aerial', value: 'ae' },
    { display: 'Aquatic', value: 'aq' },
    { display: 'Semi-aquatic', value: 'sa' },
    { display: 'Terrestrial', value: 'te' },
  ]

  const feedingHabitat2Options = [
    emptyOption,
    { display: 'Feeds primarily while in flight', value: 'aerial' },
    { display: 'Feeds in the trees, never on ground', value: 'canopy' },
    { display: 'Feeds on ground and on trunk, lower branches, or even canopy of trees', value: 'arb/surf' },
    { display: 'Caves', value: 'caves' },
    { display: 'Feeds only on ground surface', value: 'surface' },
    { display: 'Feeds primarily underground', value: 'u_ground' },
    { display: 'Feeds primarily while submerged or at water surface', value: 'aquatic' },
  ]

  const shelterHabitat1Options = [
    emptyOption,
    { display: 'Aerial', value: 'ae' },
    { display: 'Terrestrial', value: 'te' },
    { display: 'Semi-aquatic', value: 'sa' },
    { display: 'Aquatic', value: 'aq' },
  ]

  const shelterHabitat2Options = [
    emptyOption,
    { display: 'Shelters in the trees, never on ground', value: 'canopy' },
    { display: 'Shelters on ground or on trunk, lower branches of trees', value: 'arb/surf' },
    { display: 'Caves', value: 'caves' },
    { display: 'Shelters only on ground surface', value: 'surface' },
    { display: 'Shelters primarily underground', value: 'u_ground' },
    { display: 'Shelters under or at water surface', value: 'aquatic' },
  ]
  const locomotion1Options = [
    emptyOption,
    { display: 'Aerial', value: 'ae' },
    { display: 'Terrestrial', value: 'te' },
    { display: 'Semi-aquatic', value: 'sa' },
    { display: 'Aquatic', value: 'aq' },
  ]

  const locomotion2Options = [
    emptyOption,
    { display: 'Aerial', value: 'aerial' },
    { display: 'Active flying: most birds, bats', value: 'pow_flight' },
    { display: 'Gliding, soaring', value: 'npow_flight' },
    { display: 'Arboreal', value: 'arboreal' },
    { display: 'Scansorial', value: 'scansorial' },
    { display: 'Surface', value: 'surficial' },
    { display: 'Semi-fossorial', value: 'semi-fossorial' },
    { display: 'Fossorial', value: 'fossorial' },
  ]

  const locomotion3Options = [
    emptyOption,
    { display: 'Arboreal, above branch', value: 'arb_above_br' },
    { display: 'Arboreal, below-branch suspensory', value: 'arb_suspensory' },
    { display: 'Bipedal striding', value: 'bipedal_str' },
    { display: 'Running specialists', value: 'cursorial' },
    { display: 'Fast powered flight (e.g., ducks, free-tailed bats)', value: 'fast_flight' },
    { display: 'General, unspecialized quadrupedal', value: 'gen_quad' },
    { display: 'Short, controlled nonpowered flight, glide angle < 45deg', value: 'glide' },
    { display: 'Graviportal, e.g., elephants', value: 'graviportal' },
    { display: 'Powered flight  with specializations for hovering', value: 'hover' },
    { display: 'Knuckle-walking', value: 'k_walk' },
    { display: 'Nonpowered flight, glide angle >45deg', value: 'parachute' },
    { display: 'Jumping, hopping, "ricochetal"', value: 'saltatory' },
    { display: 'Fly slow or fast', value: 's/f_flight' },
    { display: 'Slow powered flight', value: 'slow_flight' },
    { display: 'All types of soaring', value: 'soar' },
    { display: 'Undulate, e.g., snakes', value: 'undulate' },
    { display: 'Sub-cursorial', value: 'sub_curs' },
    { display: 'Hyper-cursorial', value: 'hyper_curs' },
    { display: 'Swim-paraxial', value: 'swim_parax' },
  ]

  const activityOptions = [
    emptyOption,
    { display: 'Diurnal', value: 'd' },
    { display: 'Crepuscular', value: 'c' },
    { display: 'Nocturnal', value: 'n' },
  ]

  const feedingHabitat = [
    ['Feeding Habitat 1', dropdown('feedinghab1', feedingHabitat1Options, 'Feeding Habitat 1')],
    ['Feeding Habitat 2', dropdown('feedinghab2', feedingHabitat2Options, 'Feeding Habitat 2')],
  ]

  const shelterHabitat = [
    ['Shelter Habitat 1', dropdown('shelterhab1', shelterHabitat1Options, 'Shelter Habitat 1')],
    ['Shelter Habitat 2', dropdown('shelterhab2', shelterHabitat2Options, 'Shelter Habitat 2')],
  ]

  const locomotion = [
    ['Locomotion 1', dropdown('locomo1', locomotion1Options, 'Locomotion 1')],
    ['Locomotion 2', dropdown('locomo2', locomotion2Options, 'Locomotion 2')],
    ['Locomotion 3', dropdown('locomo3', locomotion3Options, 'Locomotion 3')],
    ['Activity', dropdown('activity', activityOptions, 'Activity')],
  ]

  return (
    <>
      <HalfFrames>
        <ArrayFrame half array={feedingHabitat} title="Feeding Habitat" />
        <ArrayFrame half array={shelterHabitat} title="Shelter Habitat" />
      </HalfFrames>
      <ArrayFrame array={locomotion} title="Locomotion" />
    </>
  )
}
