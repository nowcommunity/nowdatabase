import { Box } from '@mui/material'
import { Locality } from '@/backendTypes'
import { ArrayFrame, DataValue, EditableTable, Grouped } from '../../DetailView/common/FormComponents'
import { useDetailContext, useGetEditableTextField } from '../../DetailView/hooks'
import { MRT_ColumnDef } from 'material-react-table'

export const LocalityTab = () => {
  const getEditableTextField = useGetEditableTextField<Locality>()
  const { editData } = useDetailContext<Locality>()

  const originalSynonyms = editData.synonyms ?? []

  const textField = (field: keyof Locality) => (
    <DataValue<Locality> field={field} EditElement={getEditableTextField(field)} />
  )

  const synonymColumns: MRT_ColumnDef<{ synonym: string }>[] = [
    {
      accessorKey: 'synonym',
      header: 'Synonym',
      id: 'synonym',
    },
  ]

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

  const data = [
    {
      synonym: 'Synonyymi 1',
      index: 0,
    },
    {
      synonym: 'Synonyymi 2',
      index: 1,
    },
  ]

  const clickRow = (index: number) => {
    
  }

  return (
    <Box>
      <ArrayFrame array={name} title="Name" />
      <ArrayFrame array={locality} title="Locality" />
      <ArrayFrame array={country} title="Country" />
      <ArrayFrame array={status} title="Status" />
      <ArrayFrame array={latlong} title="Latitude & Longitude" />
      <Grouped title="Synonym">
        <EditableTable columns={synonymColumns} data={data} clickRow={clickRow} />
      </Grouped>
    </Box>
  )
}
