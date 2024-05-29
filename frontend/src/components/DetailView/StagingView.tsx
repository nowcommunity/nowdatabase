import { LocalityDetailsType } from '@/backendTypes'
import { ArrayFrame } from './common/tabLayoutHelpers'
import { useDetailContext } from './Context/DetailContext'

export const StagingView = () => {
  const { bigTextField } = useDetailContext<LocalityDetailsType>()

  const array = [
    ['Date', new Date().toLocaleDateString('en-CA')],
    ['Editor', 'Users Name'],
    ['Coordinator', 'Indre Zliobaite'],
    ['Comment', bigTextField('update_comment')],
  ]

  return <ArrayFrame array={array} title="Reference for the new data" />
}
