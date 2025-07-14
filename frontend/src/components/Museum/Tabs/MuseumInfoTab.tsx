import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Museum } from '@/shared/types'

export const MuseumInfoTab = () => {
  const { textField, radioSelection } = useDetailContext<Museum>()
  const { editData } = useDetailContext()

  const museumInfo = [
    ['Institution', textField('institution')],
    ['Alt. name', textField('alt_int_name')],
    ['City', textField('city')],
    ['Country', textField('country')],
    ['State', textField('state')],
    ['State code', textField('state_code')],
    [
      'Used morph',
      radioSelection(
        'used_morph',
        [
          { value: 'null', display: 'No' },
          { value: 'true', display: 'Yes' },
        ],
        'used-morph'
      ),
    ],
    [
      'Used now',
      radioSelection(
        'used_now',
        [
          { value: 'null', display: 'No' },
          { value: 'true', display: 'Yes' },
        ],
        'used-now'
      ),
    ],
    [
      'Used gene',
      radioSelection(
        'used_gene',
        [
          { value: 'null', display: 'No' },
          { value: 'true', display: 'Yes' },
        ],
        'used-gene'
      ),
    ],
    ['Museum code', textField('museum', { type: 'text', readonly: true })],
  ]

  return (
    <>
      <ArrayFrame array={museumInfo} title="Museum information" />
    </>
  )
}
