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
import { useState, useEffect } from 'react'

const convertDecToDms = (dec: number | null | undefined, isLatitude: boolean) => {
  if (typeof dec !== 'number') return undefined

  const max_degrees = isLatitude ? 90 : 180

  const dec_absolute = Math.abs(dec)
  if (dec_absolute > max_degrees) return undefined

  const degrees = Math.floor(dec_absolute)
  const minutesNotTruncated = getDecimalPart(dec_absolute) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = Math.floor(getDecimalPart(minutesNotTruncated) * 60)

  let direction = ''
  if (isLatitude) {
    direction = dec >= 0 ? 'N' : 'S'
  } else {
    direction = dec >= 0 ? 'E' : 'W'
  }

  return degrees + ' ' + minutes + ' ' + seconds + ' ' + direction
}

const convertDmsToDec = (dms: string | null | undefined, isLatitude: boolean) => {
  if (typeof dms !== 'string') return undefined

  const dmsRegEx = /^(\d{1,3}) (\d{1,2}) (\d{1,2}) ([NSEW])$/
  if (!dmsRegEx.test(dms)) return undefined

  const dmsArray = dms.split(' ')
  if (dmsArray.length != 4) return undefined

  const degrees = Number(dmsArray[0])
  const minutes = Number(dmsArray[1])
  const seconds = Number(dmsArray[2])
  const direction = dmsArray[3]

  let dec = Number((degrees + minutes / 60 + seconds / 3600).toFixed(12))

  const max_dec = isLatitude ? 90 : 180
  if (dec > max_dec) return undefined

  if (direction == 'S' || direction == 'W') {
    dec = dec * -1
  }

  return dec
}

// get decimal part by converting to string to avoid false precision
const getDecimalPart = (value: number) => {
  const stringValue = String(value)
  const index = stringValue.indexOf('.')
  return Number('0.' + (index > -1 ? stringValue.substring(index + 1) : '0'))
}

export const LocalityTab = () => {
  const { textField, radioSelection, dropdown, mode, bigTextField } = useDetailContext<LocalityDetailsType>()
  const { editData, setEditData } = useDetailContext<LocalityDetailsType>()

  /* These states are used to differentiate between user input and automatic conversion (the useEffects below) of coordinate fields.
     They are passed to the textfield-objects of their respective fields 
     They are simply incremented, and their value isn't used for anything (only it's change is tracked) */
  const [dmsLatChanged, setDmsLatChanged] = useState(0)
  const [decLatChanged, setDecLatChanged] = useState(0)
  const [dmsLongChanged, setDmsLongChanged] = useState(0)
  const [decLongChanged, setDecLongChanged] = useState(0)

  useEffect(() => {
    setEditData({ ...editData, dec_lat: convertDmsToDec(editData.dms_lat, true) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dmsLatChanged])

  useEffect(() => {
    setEditData({ ...editData, dms_lat: convertDecToDms(editData.dec_lat, true) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decLatChanged])

  useEffect(() => {
    setEditData({ ...editData, dec_long: convertDmsToDec(editData.dms_long, false) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dmsLongChanged])

  useEffect(() => {
    setEditData({ ...editData, dms_long: convertDecToDms(editData.dec_long, false) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decLongChanged])

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
  const latlong = [
    ['', 'dms', 'dec'],
    [
      'Latitude',
      textField('dms_lat', { type: 'text', changeSetter: setDmsLatChanged }),
      textField('dec_lat', { type: 'number', changeSetter: setDecLatChanged }),
    ],
    [
      'Longitude',
      textField('dms_long', { type: 'text', changeSetter: setDmsLongChanged }),
      textField('dec_long', { type: 'number', changeSetter: setDecLongChanged }),
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

  // ONLY dec coordinates, no conversion to dms yet
  // eslint-disable-next-line @typescript-eslint/require-await
  const onSaveCoord = async () => {
    setEditData({ ...editData, dec_lat: coordinates.lat, dec_long: coordinates.lng })
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
