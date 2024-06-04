import { TimeBoundDetailsType } from '@/backendTypes'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const BoundTab = () => {
  const { textField } = useDetailContext<TimeBoundDetailsType>()

  const bound = [
    // TODO Add static Class field
    ['Bound Id', textField('bid')],
    ['Name', textField('b_name')],
    ['Age (Ma)', textField('age')],
    ['Comment', textField('b_comment')],
  ]

  return (
    <>
      <ArrayFrame array={bound} title="Bound" />
    </>
  )
}
