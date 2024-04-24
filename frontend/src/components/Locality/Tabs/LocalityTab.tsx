import { Box, Grid } from '@mui/material'
import { Locality } from '@/backendTypes'
import { ArrayFrame, DataValue, EditingModal, Grouped } from '../../DetailView/common/FormComponents'
import { useGetEditableTextField } from '../../DetailView/hooks'

export const LocalityTab = () => {
  const getEditableTextField = useGetEditableTextField<Locality>()

  const textField = (field: keyof Locality) => (
    <DataValue<Locality> field={field} EditElement={getEditableTextField(field)} />
  )

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
    <Box>
      <ArrayFrame array={name} title="Name" />
      <ArrayFrame array={locality} title="Locality" />
      <ArrayFrame array={country} title="Country" />
      <ArrayFrame array={status} title="Status" />
      <ArrayFrame array={latlong} title="Latitude & Longitude" />
      <Grouped title="Synonym">
        <EditingModal buttonText="Add synonym">
          <Grid container direction="column">
            <Grid container direction="row">
              <Grid item xs={6}>1</Grid>
              <Grid item xs={6}>2</Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item xs={6}>1</Grid>
              <Grid item xs={6}>2</Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item xs={6}>1</Grid>
              <Grid item xs={6}>2</Grid>
            </Grid>
          </Grid>
        </EditingModal>
      </Grouped>
    </Box>
  )
}
