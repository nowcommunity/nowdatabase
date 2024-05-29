import { LocalityDetails } from '@/backendTypes'
import { ArrayFrame } from './common/tabLayoutHelpers'
import { useDetailContext } from './hooks'

export const StagingView = () => {
  const { bigTextField } = useDetailContext<LocalityDetails>()
  const array = [
    ['Date', new Date().toLocaleDateString('en-CA')],
    ['Editor', 'Users Name'],
    ['Coordinator', 'Indre Zliobaite'],
    ['Comment', bigTextField('update_comment')],
  ]
  return <ArrayFrame array={array} title="Reference for the new data" />
}
