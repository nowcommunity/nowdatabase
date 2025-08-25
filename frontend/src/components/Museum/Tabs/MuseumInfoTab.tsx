import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { modeOptionToMode, useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useNotify } from '@/hooks/notification'
import { Museum } from '@/shared/types'
import { validCountries } from '@/shared/validators/countryList'
import { useEffect } from 'react'

export const MuseumInfoTab = ({ isNew }: { isNew?: boolean }) => {
  const { textField, dropdownWithSearch, mode } = useDetailContext<Museum>()
  const { notify } = useNotify()

  useEffect(() => {
    if (mode === modeOptionToMode['new']) {
      notify(
        "Due to current limitations, using an existing museum's code will overwrite that museum with the one you are currently creating. \n \
        Check that you are using a unique museum code.",
        'warning',
        null
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

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
