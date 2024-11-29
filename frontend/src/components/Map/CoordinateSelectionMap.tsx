import { useRef, useMemo, useState, KeyboardEvent, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { TextField, List, ListItem, ListItemButton, ListItemText, Box, Button } from '@mui/material'
import 'leaflet/dist/leaflet.css'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import { Icon } from 'leaflet'
import { useLazyGetGeonamesQuery } from '../../redux/geonamesReducer'
import { ParsedGeoname } from '../../backendTypes'

type Coordinate = {
  lat: number
  lng: number
}

type CoordinateSetter = (Coordinate: Coordinate) => void

const DraggableMarker = ({
  markerCoordinates,
  setMarkerCoordinates,
}: {
  markerCoordinates: Coordinate
  setMarkerCoordinates: CoordinateSetter
}) => {
  const markerRef = useRef<L.Marker>(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setMarkerCoordinates(marker.getLatLng())
        }
      },
    }),
    [setMarkerCoordinates]
  )

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={markerCoordinates}
      ref={markerRef}
      icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
    />
  )
}

const ViewSetter = ({ viewCoordinates }: { viewCoordinates: Coordinate }) => {
  const map = useMap()
  useEffect(() => {
    map.setView(viewCoordinates)
  }, [viewCoordinates, map])
  return null
}

const LocationSearch = ({
  setViewCoordinates,
  setMarkerCoordinates,
}: {
  setViewCoordinates: CoordinateSetter
  setMarkerCoordinates: CoordinateSetter
}) => {
  const [searchBoxValue, setSearchBoxValue] = useState('')
  const [resultsList, setResultsList] = useState<ParsedGeoname[]>([])

  const [getGeonames] = useLazyGetGeonamesQuery()

  const handleSearch = async (search: string) => {
    const { data } = await getGeonames(search)
    if (data) {
      setResultsList(data?.locations)
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      void handleSearch(searchBoxValue)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
        <TextField
          onChange={event => {
            setSearchBoxValue(event.target.value)
          }}
          value={searchBoxValue}
          onKeyDown={handleKeyDown}
          placeholder="Search for a place..."
        />
        <Button variant="contained" onClick={() => void handleSearch(searchBoxValue)}>
          {'Search'}
        </Button>
      </Box>
      <List>
        {resultsList.map((result, index) => (
          <ListItem key={index} sx={{ backgroundColor: 'lightgray' }}>
            <ListItemButton
              onClick={() => {
                setViewCoordinates({ lat: result.lat, lng: result.lng })
                setMarkerCoordinates({ lat: result.lat, lng: result.lng })
              }}
            >
              <ListItemText primary={`${result.name}, ${result.countryName}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export const CoordinateSelectionMap = ({
  markerCoordinates,
  setMarkerCoordinates,
}: {
  markerCoordinates: Coordinate
  setMarkerCoordinates: CoordinateSetter
}) => {
  const mapRef = useRef(null)
  const latitude = 30
  const longitude = -5
  const [viewCoordinates, setViewCoordinates] = useState({ lat: 60.202665856, lng: 24.957662836 })

  return (
    <div>
      <MapContainer center={[latitude, longitude]} zoom={2} ref={mapRef} style={{ height: '50vh', width: '50vw' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker markerCoordinates={markerCoordinates} setMarkerCoordinates={setMarkerCoordinates} />
        <ViewSetter viewCoordinates={viewCoordinates} />
      </MapContainer>
      <p>
        Latitude: {markerCoordinates ? markerCoordinates.lat : null}, Longitude:{' '}
        {markerCoordinates ? markerCoordinates.lng : null}
      </p>
      <LocationSearch setViewCoordinates={setViewCoordinates} setMarkerCoordinates={setMarkerCoordinates} />
    </div>
  )
}
