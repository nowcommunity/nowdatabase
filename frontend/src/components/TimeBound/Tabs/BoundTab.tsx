import { TimeBoundDetailsType } from '@/backendTypes'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const BoundTab = () => {
  const { data, textField } = useDetailContext<TimeBoundDetailsType>()

  const bound = [
    ['Bound Id', data.bid],
    ['Name', textField('b_name')],
    ['Age (Ma)', textField('age', { type: 'number' })],
    ['Comment', textField('b_comment')],
  ]

  return (
    <>
      <ArrayFrame array={bound} title="Bound" />
    </>
  )
}
