import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Museum } from '@/shared/types'
import { validCountries } from '@/shared/validators/countryList'

export const MuseumInfoTab = ({ isNew }: { isNew?: boolean }) => {
  const { textField, dropdownWithSearch } = useDetailContext<Museum>()

  const countryOptions = ['', ...validCountries]

  const museumInfo = [
    ['Institution', textField('institution')],
    ['Alt. name', textField('alt_int_name')],
    ['City', textField('city')],
    ['Country', dropdownWithSearch('country', countryOptions, 'Country')],
    ['State', textField('state')],
    ['State code', textField('state_code')],
    ['Museum code', textField('museum', { type: 'text', readonly: !isNew })],
  ]

  return (
    <>
      <ArrayFrame array={museumInfo} title="Museum information" />
    </>
  )
}
