import { LocalityDetails } from '@/backendTypes'
import { ArrayFrame } from '../../DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'

export const LocalityTab = () => {
  const { textField } = useDetailContext<LocalityDetails>()

  const info = [
    ['Name', textField('loc_name')],
    ['Status', textField('loc_status')],
  ]
  const country = [
    ['Country', textField('country')],
    ['State', textField('state')],
    ['County', textField('county')],
    ['Detail', textField('loc_detail')],
    ['Site Area', textField('site_area')],
    ['General Locality', textField('gen_loc')],
    ['Plate', textField('plate')],
  ]
  const latlong = [
    ['', 'dms', 'dec'],
    ['Latitude', textField('dms_lat'), textField('dec_lat')],
    ['Longitude', textField('dms_long'), textField('dec_long')],
    ['Approximate Coordinates', textField('approx_coord')],
    ['Altitude (m)', textField('altitude')],
  ]

  return (
    <>
      <ArrayFrame array={info} title="Info" />
      <ArrayFrame array={country} title="Country" />
      <ArrayFrame array={latlong} title="Latitude & Longitude" />
    </>
  )
}
