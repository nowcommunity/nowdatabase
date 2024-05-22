import { Editable, LocalityDetails, LocalitySynonym } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/hooks'
import { Grouped, ArrayFrame, HalfFrames } from '@/components/DetailView/common/FormComponents'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useForm } from 'react-hook-form'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingModal } from '@/components/DetailView/common/EditingModal'

export const LocalityTab = () => {
  const { data, editData, textField, radioSelection, dropdown, mode } = useDetailContext<LocalityDetails>()

  const approximateCoordinatesOptions = ['', { display: 'No', value: '0' }, { display: 'Yes', value: '1' }]
  const generalLocalityOptions = ['', { display: 'No', value: 'n' }, { display: 'Yes', value: 'y' }]

  const siteAreaOptions = [
    '',
    { display: '<10 m2', value: '<10m2' },
    { display: '10-50 m2', value: '10-50m2' },
    { display: '50-100 m2', value: '50-100m2' },
    { display: '100-1000 m2', value: '100-1000m2' },
    { display: '>1000 m2', value: '>1000m2' },
  ]

  const getStatusText = () => (data.loc_status ? <>Private</> : <>Public</>)

  const info = [
    ['Name', textField('loc_name')],
    [
      'Visibility status',
      mode === 'edit'
        ? radioSelection(
            'loc_status',
            [
              { value: 'false', display: 'Public' },
              { value: 'true', display: 'Private' },
            ],
            'Status'
          )
        : getStatusText(),
    ],
  ]
  const country = [
    ['Country', textField('country')],
    ['State', textField('state')],
    ['County', textField('county')],
    ['Detail', textField('loc_detail')],
    ['Site Area', dropdown('site_area', siteAreaOptions, 'Site Area')],
    ['General Locality', dropdown('gen_loc', generalLocalityOptions, 'General Locality')],
    ['Plate', textField('plate')],
  ]
  const latlong = [
    ['', 'dms', 'dec'],
    ['Latitude', textField('dms_lat'), textField('dec_lat')],
    ['Longitude', textField('dms_long'), textField('dec_long')],
    ['Approximate Coordinates', dropdown('approx_coord', approximateCoordinatesOptions, 'Approximate Coordinates')],
    ['Altitude (m)', textField('altitude')],
  ]

  const {
    register,
    formState: { errors },
  } = useForm()

  const columns: MRT_ColumnDef<LocalitySynonym>[] = [
    {
      accessorKey: 'synonym',
      header: 'Synonym',
    },
  ]

  // eslint-disable-next-line @typescript-eslint/require-await
  const onSave = async () => {
    // TODO: Saving logic here (add Synonym to editData)
    return Object.keys(errors).length === 0
  }

  const editingModal = (
    <EditingModal buttonText="Add new Synonym" onSave={onSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <TextField {...register('synonym', { required: true })} label="Synonym" required />
      </Box>
    </EditingModal>
  )

  return (
    <>
      <HalfFrames>
        <ArrayFrame half array={info} title="Info" />
        <ArrayFrame half array={country} title="Country" />
      </HalfFrames>

      <ArrayFrame array={latlong} title="Latitude & Longitude" />

      <Grouped title="Synonyms">
        {mode === 'edit' && editingModal}
        <EditableTable<Editable<LocalitySynonym>, LocalityDetails>
          columns={columns}
          data={editData.now_syn_loc}
          editable
          field="now_syn_loc"
        />
      </Grouped>
    </>
  )
}
