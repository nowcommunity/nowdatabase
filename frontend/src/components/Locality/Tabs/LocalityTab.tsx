import { Box } from '@mui/material'
import { Locality } from '@/backendTypes'
import { ArrayFrame, DataValue } from '../../DetailView/common/FormComponents'
import { useGetEditableTextField } from '../../DetailView/hooks'

export const LocalityTab = () => {
  const getEditableTextField = useGetEditableTextField<Locality>()

  const valueField = (field: keyof Locality) => <DataValue<Locality> field={field} editElement={getEditableTextField} />

  const name = [['Name', valueField('loc_name')]]
  const locality = [['Country', valueField('country')]]
  const country = [
    ['Country', valueField('country')],
    ['State', valueField('state')],
    ['County', valueField('county')],
    ['Detail', valueField('loc_detail')],
    ['Site Area', valueField('site_area')],
    ['General Locality', valueField('gen_loc')],
    ['Plate', valueField('plate')],
  ]
  const status = [['Status', valueField('loc_status')]]
  const latlong = [
    ['', 'dms', 'dec'],
    ['Latitude', valueField('dms_lat'), valueField('dec_lat')],
    ['Longitude', valueField('dms_long'), valueField('dec_long')],
    ['Approximate Coordinates', valueField('approx_coord')],
    ['Altitude (m)', valueField('altitude')],
  ]
  return (
    <Box>
      <ArrayFrame array={name} title="Name" />
      <ArrayFrame array={locality} title="Locality" />
      <ArrayFrame array={country} title="Country" />
      <ArrayFrame array={status} title="Status" />
      <ArrayFrame array={latlong} title="Latitude & Longitude" />
    </Box>
  )
}
