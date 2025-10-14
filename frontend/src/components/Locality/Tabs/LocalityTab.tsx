import { Editable, LocalityDetailsType, LocalitySynonym } from '@/shared/types'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Grouped, ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { Box, TextField } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { useForm } from 'react-hook-form'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { emptyOption } from '@/components/DetailView/common/misc'
import { CoordinateSelectionMap } from '@/components/Map/CoordinateSelectionMap'
import { useState } from 'react'
import { convertDmsToDec, convertDecToDms } from '@/util/coordinateConversion'
import { validCountries } from '@/shared/validators/countryList'
import { SingleLocalityMap } from '@/components/Map/SingleLocalityMap'

export const LocalityTab = () => {
  const { textField, radioSelection, dropdown, dropdownWithSearch, mode, bigTextField } =
    useDetailContext<LocalityDetailsType>()
  const { editData, setEditData } = useDetailContext<LocalityDetailsType>()

  const hasCoordinates = editData.dec_lat != null && editData.dec_long != null

  const generalLocalityOptions = [emptyOption, { display: 'No', value: 'n' }, { display: 'Yes', value: 'y' }]

  const siteAreaOptions = [
    emptyOption,
    { display: '<10 m2', value: '<10m2' },
    { display: '10-50 m2', value: '10-50m2' },
    { display: '50-100 m2', value: '50-100m2' },
    { display: '100-1000 m2', value: '100-1000m2' },
    { display: '>1000 m2', value: '>1000m2' },
  ]

  const countryOptions = ['', ...validCountries]

  const info = [
    ['Name', textField('loc_name')],
    [
      'Visibility status',
      radioSelection(
        'loc_status',
        [
          { value: 'false', display: 'Public' },
          { value: 'true', display: 'Private' },
        ],
        'Status'
      ),
    ],
  ]
  const country = [
    ['Country', dropdownWithSearch('country', countryOptions, 'Country')],
    ['State', textField('state')],
    ['County', textField('county')],
    ['Detail', bigTextField('loc_detail')],
    ['Site Area', dropdown('site_area', siteAreaOptions, 'Site Area')],
    ['General Locality', dropdown('gen_loc', generalLocalityOptions, 'General Locality')],
    ['Plate', textField('plate')],
  ]

  const handleCoordinateChange = (
    value: number | string | Date,
    dmsOrDec: 'dms' | 'dec',
    latitudeOrLongitude: 'latitude' | 'longitude'
  ) => {
    const latOrLong = latitudeOrLongitude === 'latitude' ? 'lat' : 'long'
    const dmsField = 'dms' + '_' + latOrLong
    const decField = 'dec' + '_' + latOrLong

    if (dmsOrDec === 'dms') {
      const valueAsString = String(value)
      setEditData({
        ...editData,
        [dmsField]: valueAsString,
        [decField]: convertDmsToDec(valueAsString, latitudeOrLongitude),
      })
    } else {
      if (value === '') {
        setEditData({ ...editData, [decField]: undefined, [dmsField]: undefined })
        return
      }
      const valueAsNumber = Number(value)
      setEditData({
        ...editData,
        [decField]: Number(value),
        [dmsField]: convertDecToDms(valueAsNumber, latitudeOrLongitude),
      })
    }
  }

  const latlong = [
    ['', 'dms', 'dec'],
    [
      'Latitude',
      textField('dms_lat', {
        type: 'text',
        handleSetEditData: value => handleCoordinateChange(value, 'dms', 'latitude'),
      }),
      textField('dec_lat', {
        type: 'number',
        handleSetEditData: value => handleCoordinateChange(value, 'dec', 'latitude'),
      }),
    ],
    [
      'Longitude',
      textField('dms_long', {
        type: 'text',
        handleSetEditData: value => handleCoordinateChange(value, 'dms', 'longitude'),
      }),
      textField('dec_long', {
        type: 'number',
        handleSetEditData: value => handleCoordinateChange(value, 'dec', 'longitude'),
      }),
    ],
    [
      'Approximate Coordinates',
      radioSelection(
        'approx_coord',
        [
          { value: 'false', display: 'No' },
          { value: 'true', display: 'Yes' },
        ],
        'Approximate Coordinates'
      ),
    ],
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
  const [markerCoordinates, setMarkerCoordinates] = useState({ lat: 60.202665856, lng: 24.957662836 })

  // eslint-disable-next-line @typescript-eslint/require-await
  const onCoordinateSelectorSave = async () => {
    setEditData({
      ...editData,
      dec_lat: markerCoordinates.lat,
      dms_lat: convertDecToDms(markerCoordinates.lat, 'latitude'),
      dec_long: markerCoordinates.lng,
      dms_long: convertDecToDms(markerCoordinates.lng, 'longitude'),
    })
    return Object.keys(errors).length === 0 //no idea if this is needed, just copypasted
  }

  // TODO name this better, plagiarized from editingModal
  const coordinateButton = (
    <EditingModal buttonText="Get Coordinates" onSave={onCoordinateSelectorSave}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <CoordinateSelectionMap markerCoordinates={markerCoordinates} setMarkerCoordinates={setMarkerCoordinates} />
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
          }}
        >
          <ArrayFrame array={latlong} title="Latitude & Longitude" />
          <Box sx={{ width: '50%' }}>
            {hasCoordinates && <SingleLocalityMap decLat={editData.dec_lat} decLong={editData.dec_long} />}
          </Box>
        </Box>
        {!mode.read && coordinateButton}
      </Grouped>

      <Grouped title="Synonyms">
        {!mode.read && editingModal}
        <EditableTable<Editable<LocalitySynonym>, LocalityDetailsType> columns={columns} field="now_syn_loc" />
      </Grouped>
    </>
  )
}
