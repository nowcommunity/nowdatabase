import { Box, Grid } from '@mui/material'
import { Locality } from '../../../redux/localityReducer'
import { DataValue, Grouped } from '../../DetailView/common/FormComponents'
import { useGetEditableTextField } from '../../DetailView/hooks'
import { ReactNode } from 'react'

const ArrayToTable = ({ array }: { array: Array<Array<ReactNode>> }) => (
  <Grid container direction="row">
    {array.map(row => (
      <Grid container direction="row" height="2.5em">
        {row.map((item, index) => (
          <Grid key={index} item xs={2} padding="5px">
            {item}
          </Grid>
        ))}
      </Grid>
    ))}
  </Grid>
)

export const ArrayFrame = ({ array, title }: { array: Array<Array<ReactNode>>; title: string }) => (
  <Grouped title={title}>
    <ArrayToTable array={array} />
  </Grouped>
)

export const AgeTab = () => {
  const getEditableTextField = useGetEditableTextField<Locality>()

  const valueField = (field: keyof Locality) => (
    <DataValue<Locality> field={field as keyof Locality} editElement={getEditableTextField} />
  )

  const age = [
    ['Dating method', valueField('date_meth')],
    ['Age (Ma)', 'Basis for age (Absolute)', 'Basis for age (Time Unit)', 'Basis for age (Fraction)'],
    ['Minimum age', valueField('bfa_min_abs'), valueField('bfa_min'), valueField('frac_min')],
    ['Maximum age', valueField('bfa_max_abs'), valueField('bfa_max'), valueField('frac_max')],
    ['Chronostrathigraphic age', valueField('chron')],
    ['Age Comment', valueField('age_comm')],
  ]

  const lithostratigraphy = [
    ['Group', valueField('lgroup')],
    ['Formation', valueField('formation')],
    ['Member', valueField('member')],
    ['Bed', valueField('bed')],
  ]

  const sampleUnit = [
    ['Datum Plane', valueField('datum_plane')],
    ['Top of Sample Unit(m)', valueField('tos')],
    ['Bottom of Sample Unit (m)', valueField('bos')],
  ]

  const basinInformation = [
    ['Basin', valueField('basin')],
    ['Subbasin', valueField('subbasin')],
  ]

  return (
    <Box>
      <ArrayFrame array={age} title="Age" />
      <ArrayFrame array={lithostratigraphy} title="Lithostratigraphy" />
      <ArrayFrame array={sampleUnit} title="Sample Unit" />
      <ArrayFrame array={basinInformation} title="Basin Information" />
    </Box>
  )
}
