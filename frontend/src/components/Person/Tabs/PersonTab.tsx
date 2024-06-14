import { PersonDetailsType } from '@/backendTypes'
import { ArrayFrame } from '../../DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const PersonTab = () => {
  const { textField } = useDetailContext<PersonDetailsType>()

  const person = [
    ['User ID', textField('user_id', 'number')],
    ['Initials', textField('initials')],
    ['First Name', textField('first_name')],
    ['Surname', textField('surname')],
    ['Email', textField('email')],
    ['Organization', textField('organization')],
    ['Country', textField('country')],
  ]

  return (
    <>
      <ArrayFrame array={person} title="Person" />
    </>
  )
}
