import { LocalityDetails } from '@/backendTypes'
import { ArrayFrame, HalfFrames } from '../../DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'

export const LocalityTab = () => {
  const { textField } = useDetailContext<LocalityDetails>()

  const name = [['Name', textField('loc_name')]]
  const locality = [['Country', textField('country')]]
  const country = [
    ['Country', textField('country')],
    ['State', textField('state')],
    ['County', textField('county')],
    ['Detail', textField('loc_detail')],
    ['Site Area', textField('site_area')],
    ['General Locality', textField('gen_loc')],
    ['Plate', textField('plate')],
  ]
  const status = [['Status', textField('loc_status')]]
  const latlong = [
    ['', 'dms', 'dec'],
    ['Latitude', textField('dms_lat'), textField('dec_lat')],
    ['Longitude', textField('dms_long'), textField('dec_long')],
    ['Approximate Coordinates', textField('approx_coord')],
    ['Altitude (m)', textField('altitude')],
  ]

  return (
    <>
      <HalfFrames>
        <ArrayFrame half array={name} title="Name" />
        <ArrayFrame half array={locality} title="Locality" />
      </HalfFrames>
      <ArrayFrame array={country} title="Country" />
      <ArrayFrame array={status} title="Status" />
      <ArrayFrame array={latlong} title="Latitude & Longitude" />
    </>
  )
}
