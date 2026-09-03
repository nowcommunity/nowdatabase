import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { OccurrenceDetailsType } from '@/shared/types'
import { calculateNormalizedMesowearScore, mesowearOptions, microwearOptions } from '../constants'

export const OccurrenceWearTab = () => {
  const { data, editData, mode, textField, dropdown } = useDetailContext<OccurrenceDetailsType>()
  const sourceData = mode.read ? data : editData
  const normalizedScore = calculateNormalizedMesowearScore(
    sourceData.mw_value,
    sourceData.mw_scale_min,
    sourceData.mw_scale_max
  )
  const normalizedScoreText = normalizedScore === null ? '-' : normalizedScore.toFixed(2)

  console.log(editData)

  return (
    <HalfFrames>
      {[
        <ArrayFrame
          key="mesowear"
          title="Mesowear"
          array={[
            ['Mesowear', dropdown('mesowear', mesowearOptions, 'Mesowear')],
            ['MW OR High', textField('mw_or_high', { type: 'number', integerOnly: true, min: 0, max: 100 })],
            ['MW OR Low', textField('mw_or_low', { type: 'number', integerOnly: true, min: 0, max: 100 })],
            ['MW CS Sharp', textField('mw_cs_sharp', { type: 'number', integerOnly: true, min: 0, max: 100 })],
            ['MW CS Round', textField('mw_cs_round', { type: 'number', integerOnly: true, min: 0, max: 100 })],
            ['MW CS Blunt', textField('mw_cs_blunt', { type: 'number', integerOnly: true, min: 0, max: 100 })],
          ]}
        />,
        <div key="wear-score-and-microwear">
          <ArrayFrame
            key="mesowear-score"
            title="Mesowear score"
            array={[
              ['MW scale min', textField('mw_scale_min', { type: 'number', integerOnly: true, min: 0 })],
              ['MW scale max', textField('mw_scale_max', { type: 'number', integerOnly: true, min: 0 })],
              ['MW value', textField('mw_value', { type: 'number' })],
              ['Normalized Score', normalizedScoreText],
            ]}
          />
          <ArrayFrame
            key="microwear"
            title="Microwear"
            array={[['Microwear', dropdown('microwear', microwearOptions, 'Microwear')]]}
          />
        </div>,
      ]}
    </HalfFrames>
  )
}
