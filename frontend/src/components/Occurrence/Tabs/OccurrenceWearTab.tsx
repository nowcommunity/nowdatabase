import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { OccurrenceDetailsType } from '@/shared/types'
import {
  calculateNormalizedMesowearScore,
  formatMesowear,
  formatMicrowear,
  mesowearOptions,
  microwearOptions,
} from '../constants'

const toText = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === '' ? '-' : String(value)

export const OccurrenceWearTab = () => {
  const { data, editData, mode, textField, dropdown } = useDetailContext<OccurrenceDetailsType>()
  const sourceData = mode.read ? data : editData
  const normalizedScore = calculateNormalizedMesowearScore(
    sourceData.mw_value,
    sourceData.mw_scale_min,
    sourceData.mw_scale_max
  )
  const normalizedScoreText = normalizedScore === null ? '-' : normalizedScore.toFixed(2)

  return (
    <HalfFrames>
      {[
        <ArrayFrame
          key="mesowear"
          title="Mesowear"
          array={[
            [
              'Mesowear',
              mode.read ? formatMesowear(sourceData.mesowear) : dropdown('mesowear', mesowearOptions, 'Mesowear'),
            ],
            [
              'MW OR High',
              mode.read
                ? toText(sourceData.mw_or_high)
                : textField('mw_or_high', { type: 'number', integerOnly: true, min: 0, max: 100 }),
            ],
            [
              'MW OR Low',
              mode.read
                ? toText(sourceData.mw_or_low)
                : textField('mw_or_low', { type: 'number', integerOnly: true, min: 0, max: 100 }),
            ],
            [
              'MW CS Sharp',
              mode.read
                ? toText(sourceData.mw_cs_sharp)
                : textField('mw_cs_sharp', { type: 'number', integerOnly: true, min: 0, max: 100 }),
            ],
            [
              'MW CS Round',
              mode.read
                ? toText(sourceData.mw_cs_round)
                : textField('mw_cs_round', { type: 'number', integerOnly: true, min: 0, max: 100 }),
            ],
            [
              'MW CS Blunt',
              mode.read
                ? toText(sourceData.mw_cs_blunt)
                : textField('mw_cs_blunt', { type: 'number', integerOnly: true, min: 0, max: 100 }),
            ],
          ]}
        />,
        <div key="wear-score-and-microwear">
          <ArrayFrame
            key="mesowear-score"
            title="Mesowear score"
            array={[
              [
                'MW scale min',
                mode.read
                  ? toText(sourceData.mw_scale_min)
                  : textField('mw_scale_min', { type: 'number', integerOnly: true, min: 0 }),
              ],
              [
                'MW scale max',
                mode.read
                  ? toText(sourceData.mw_scale_max)
                  : textField('mw_scale_max', { type: 'number', integerOnly: true, min: 0 }),
              ],
              ['MW value', mode.read ? toText(sourceData.mw_value) : textField('mw_value', { type: 'number' })],
              ['Normalized Score', normalizedScoreText],
            ]}
          />
          <ArrayFrame
            key="microwear"
            title="Microwear"
            array={[
              [
                'Microwear',
                mode.read
                  ? formatMicrowear(sourceData.microwear)
                  : dropdown('microwear', microwearOptions, 'Microwear'),
              ],
            ]}
          />
        </div>,
      ]}
    </HalfFrames>
  )
}
