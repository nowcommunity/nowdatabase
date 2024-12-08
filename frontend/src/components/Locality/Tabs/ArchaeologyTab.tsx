import { LocalityDetailsType } from '@/shared/types'
import { emptyOption } from '@/components/DetailView/common/misc'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { getHomininSkeletalRemains } from '@/types'

export const ArchaeologyTab = () => {
  const { dropdown, radioSelection, data } = useDetailContext<LocalityDetailsType>()

  const technologicalModeOptions = [
    emptyOption,
    { display: '1', value: '1' },
    { display: '2', value: '2' },
    { display: '3', value: '3' },
    { display: '4', value: '4' },
    { display: '5', value: '5' },
  ]

  const culturalStageOptions = [
    emptyOption,
    { display: 'Early Stone Age', value: 'early_stone_age' },
    { display: 'Middle Stone Age', value: 'middle_stone_age' },
    { display: 'Late Stone Age', value: 'late_stone_age' },
    { display: 'Lower Paleolithic', value: 'lower_paleolithic' },
    { display: 'Middle Paleolithic', value: 'middle_paleolithic' },
    { display: 'Upper Paleolithic/Paleoindian', value: 'upper_paleolithic/paleoindian' },
    { display: 'Mesolithic/Archaic', value: 'mesolithic/archaic' },
  ]

  const regionalCultureOptions = [
    emptyOption,
    { display: 'Acheulean', value: 'acheulean' },
    { display: 'Aterian', value: 'aterian' },
    { display: 'Aurignac', value: 'aurignac' },
    { display: 'Early Acheulean', value: 'early_acheulean' },
    { display: 'Large Flake Acheulean', value: 'large_flake_acheulean' },
    { display: 'LCT Acheulean', value: 'lct_acheulean' },
    { display: 'Levantine Acheulean', value: 'levantine_acheulean' },
    { display: 'Mousterian', value: 'mousterian' },
    { display: 'Oldowan', value: 'oldowan' },
    { display: 'Stillbay', value: 'stillbay' },
    { display: 'Tabun B', value: 'tabun_b' },
  ]

  const archaeology = [
    ['Hominin skeletal remains', getHomininSkeletalRemains(data) ? 'Yes' : 'No'],
    [
      'Stone tool cut marks on bones',
      radioSelection(
        'stone_tool_cut_marks_on_bones',
        [
          { value: 'false', display: 'No' },
          { value: 'true', display: 'Yes' },
        ],
        'cut-marks'
      ),
    ],
    [
      'Bipedal footprints',
      radioSelection(
        'bipedal_footprints',
        [
          { value: 'false', display: 'No' },
          { value: 'true', display: 'Yes' },
        ],
        'bipedal-footprints'
      ),
    ],
    [
      'Stone tool technology',
      radioSelection(
        'stone_tool_technology',
        [
          { value: 'false', display: 'No' },
          { value: 'true', display: 'Yes' },
        ],
        'stone-tool-technology'
      ),
    ],
    ['Technological mode', dropdown('technological_mode_1', technologicalModeOptions, 'Technological mode 1')],
    ['', dropdown('technological_mode_2', technologicalModeOptions, 'Technological mode 2')],
    ['', dropdown('technological_mode_3', technologicalModeOptions, 'Technological mode 3')],
    ['Cultural stage', dropdown('cultural_stage_1', culturalStageOptions, 'Cultural stage 1')],
    ['', dropdown('cultural_stage_2', culturalStageOptions, 'Cultural stage 2')],
    ['', dropdown('cultural_stage_3', culturalStageOptions, 'Cultural stage 3')],
    ['Regional culture', dropdown('regional_culture_1', regionalCultureOptions, 'Regional culture 1')],
    ['', dropdown('regional_culture_2', regionalCultureOptions, 'Regional culture 2')],
    ['', dropdown('regional_culture_3', regionalCultureOptions, 'Regional culture 3')],
  ]

  return (
    <>
      <ArrayFrame half array={archaeology} title="Archaeology" />
    </>
  )
}
