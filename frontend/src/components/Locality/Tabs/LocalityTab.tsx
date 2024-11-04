import { Editable, LocalityDetailsType, LocalitySynonym } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Grouped, ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useForm } from 'react-hook-form'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { emptyOption } from '@/components/DetailView/common/misc'
import { Map } from '@/components/Map/Map'
import { useState } from 'react'
import { convertDmsToDec, convertDecToDms } from '@/util/coordinateConversion'

export const LocalityTab = () => {
  const { textField, radioSelection, dropdown, mode, bigTextField } = useDetailContext<LocalityDetailsType>()
  const { editData, setEditData } = useDetailContext<LocalityDetailsType>()

  const approximateCoordinatesOptions = [
    { display: 'No', value: 'false' },
    { display: 'Yes', value: 'true' },
  ]
  const generalLocalityOptions = [emptyOption, { display: 'No', value: 'n' }, { display: 'Yes', value: 'y' }]

  const siteAreaOptions = [
    '',
    { display: '<10 m2', value: '<10m2' },
    { display: '10-50 m2', value: '10-50m2' },
    { display: '50-100 m2', value: '50-100m2' },
    { display: '100-1000 m2', value: '100-1000m2' },
    { display: '>1000 m2', value: '>1000m2' },
  ]

  const info = [
    ['Name', textField('loc_name')],
    [
      'Visibility status',
      radioSelection(
        'loc_status',
        [
          { value: 'false', display: 'Public' },
          { value: 'true', display: 'Draft' },
        ],
        'Status'
      ),
    ],
  ]
  const country = [
    ['Country', textField('country')],
    ['State', textField('state')],
    ['County', textField('county')],
    ['Detail', bigTextField('loc_detail')],
    ['Site Area', dropdown('site_area', siteAreaOptions, 'Site Area')],
    ['General Locality', dropdown('gen_loc', generalLocalityOptions, 'General Locality')],
    ['Plate', textField('plate')],
  ]

  const handleDmsLatChange = (value: number | string) => {
    const valueAsString = String(value)
    setEditData({ ...editData, dms_lat: valueAsString, dec_lat: convertDmsToDec(valueAsString, 'latitude') })
  }

  const handleDmsLongChange = (value: number | string) => {
    const valueAsString = String(value)
    setEditData({ ...editData, dms_long: valueAsString, dec_long: convertDmsToDec(valueAsString, 'longitude') })
  }

  const handleDecLatChange = (value: number | string) => {
    if (value === '') {
      setEditData({ ...editData, dec_lat: undefined, dms_lat: undefined })
      return
    }
    const valueAsNumber = Number(value)
    setEditData({ ...editData, dec_lat: Number(value), dms_lat: convertDecToDms(valueAsNumber, 'latitude') })
  }

  const handleDecLongChange = (value: number | string) => {
    if (value === '') {
      setEditData({ ...editData, dec_lat: undefined, dms_lat: undefined })
      return
    }
    const valueAsNumber = Number(value)
    setEditData({ ...editData, dec_long: Number(value), dms_long: convertDecToDms(valueAsNumber, 'longitude') })
  }

  const latlong = [
    ['', 'dms', 'dec'],
    [
      'Latitude',
      textField('dms_lat', { type: 'text', handleSetEditData: handleDmsLatChange }),
      textField('dec_lat', { type: 'number', handleSetEditData: handleDecLatChange }),
    ],
    [
      'Longitude',
      textField('dms_long', { type: 'text', handleSetEditData: handleDmsLongChange }),
      textField('dec_long', { type: 'number', handleSetEditData: handleDecLongChange }),
    ],
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

  // Kumpula Coordinates, could be changed later to be existing coordinates if exists
  const [coordinates, setCoordinates] = useState({ lat: 60.202665856, lng: 24.957662836 })

  // eslint-disable-next-line @typescript-eslint/require-await
  const onSaveCoord = async () => {
    setEditData({
      ...editData,
      dec_lat: coordinates.lat,
      dms_lat: convertDecToDms(coordinates.lat, 'latitude'),
      dec_long: coordinates.lng,
      dms_long: convertDecToDms(coordinates.lng, 'longitude'),
    })
    return Object.keys(errors).length === 0 //no idea if this is needed, just copypasted
  }

  // TODO name this better, plagiarized from editingModal
  const coordinateButton = (
    <EditingModal buttonText="Open Map" onSave={onSaveCoord}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <Map coordinates={coordinates} setCoordinates={setCoordinates} />
      </Box>
    </EditingModal>
  )

  return (
    <>
      <HalfFrames>
        <ArrayFrame half array={info} title="Info" />
        <ArrayFrame half array={country} title="Country" />
      </HalfFrames>

      <Grouped>
        <ArrayFrame array={latlong} title="Latitude & Longitude" />
        {!mode.read && coordinateButton}
      </Grouped>

      <Grouped title="Synonyms">
        {!mode.read && editingModal}
        <EditableTable<Editable<LocalitySynonym>, LocalityDetailsType> columns={columns} field="now_syn_loc" />
      </Grouped>
    </>
  )
}
