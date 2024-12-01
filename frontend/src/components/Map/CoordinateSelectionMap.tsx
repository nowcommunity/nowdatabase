import { useRef, useMemo, useState, KeyboardEvent, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { TextField, List, ListItem, ListItemButton, ListItemText, Box, Button, Divider, alpha } from '@mui/material'
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

const ResultsList = ({
  setViewCoordinates,
  setMarkerCoordinates,
  resultsList,
  queryStatus,
}: {
  setViewCoordinates: CoordinateSetter
  setMarkerCoordinates: CoordinateSetter
  resultsList: ParsedGeoname[]
  queryStatus: { isUninitialized: boolean; isSuccess: boolean; isError: boolean }
}) => {
  if (queryStatus.isUninitialized) {
    return <List></List>
  }

  if (queryStatus.isError) {
    return (
      <List>
        <ListItem sx={{ backgroundColor: alpha('#ff0000', 0.5) }}>
          <ListItemText primary="An error has occurred" />
        </ListItem>
      </List>
    )
  }
  if (queryStatus.isSuccess) {
    if (resultsList.length > 0) {
      return (
        <List>
          {resultsList.map((result, index) => (
            <Box key={index}>
              <ListItem>
                <ListItemButton
                  onClick={() => {
                    setViewCoordinates({ lat: result.lat, lng: result.lng })
                    setMarkerCoordinates({ lat: result.lat, lng: result.lng })
                  }}
                >
                  <ListItemText primary={`${result.name}, ${result.countryName}`} />
                </ListItemButton>
              </ListItem>
              <Divider component="li" />
            </Box>
          ))}
        </List>
      )
    } else {
      return (
        <List>
          <ListItem>
            <ListItemText primary="No results found" />
          </ListItem>
        </List>
      )
    }
  }
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

  const [getGeonames, { isUninitialized, isSuccess, isError }] = useLazyGetGeonamesQuery()

  const handleSearch = async (search: string) => {
    const { data } = await getGeonames(search)
    if (data) {
      setResultsList(data?.locations)
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (!searchBoxValue) {
        return
      }
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
          id="geonames-search-textfield"
        />
        <Button
          id="geonames-search-button"
          variant="contained"
          onClick={() => void handleSearch(searchBoxValue)}
          disabled={!searchBoxValue}
        >
          {'Search'}
        </Button>
      </Box>
      <ResultsList
        setViewCoordinates={setViewCoordinates}
        setMarkerCoordinates={setMarkerCoordinates}
        resultsList={resultsList}
        queryStatus={{ isUninitialized, isSuccess, isError }}
      />
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
