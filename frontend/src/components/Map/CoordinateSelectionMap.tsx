import { useRef, useMemo, useState, KeyboardEvent } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { TextField, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import 'leaflet/dist/leaflet.css'

type Coordinate = {
  lat: number
  lng: number
}

type CoordinateSetter = (Coordinate: Coordinate) => void

const DraggableMarker = ({ setMarkerPos, coord }: { setMarkerPos: CoordinateSetter; coord: Coordinate }) => {
  const markerRef = useRef<L.Marker>(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setMarkerPos(marker.getLatLng())
        }
      },
    }),
    [setMarkerPos]
  )

  return <Marker draggable={true} eventHandlers={eventHandlers} position={coord} ref={markerRef} />
}

const LocationSearch = () => {
  type Location = {
    name: string
    country: string
    latitude: number
    longitude: number
  }

  const [searchBoxValue, setSearchBoxValue] = useState('')
  const [resultsList, setResultsList] = useState<Location[]>([])

  const handleSearch = async () => {
    const username = String(import.meta.env.VITE_GEONAMES_USERNAME)
    const url = `http://api.geonames.org/searchJSON?q=${searchBoxValue}&maxRows=5&username=${username}`

    type Geoname = {
      adminCode01: string
      lng: string
      geonameId: number
      toponymName: string
      countryId: string
      fcl: string
      population: number
      countryCode: string
      name: string
      fclName: string
      adminCodes1: {
        ISO3166_2: string
      }
      countryName: string
      fcodeName: string
      adminName1: string
      lat: string
      fcode: string
    }
    type GeoNamesJSON = {
      totalResultsCount: number
      geonames: Geoname[]
    }

    try {
      const result = (await (await fetch(url)).json()) as GeoNamesJSON
      const locations = result.geonames.map(geoname => ({
        name: geoname.name,
        country: geoname.countryName,
        latitude: Number(geoname.lat),
        longitude: Number(geoname.lng),
      }))
      setResultsList(locations)
    } catch (error) {
      throw new Error('Location search failed')
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      void handleSearch()
    }
  }

  return (
    <div>
      <TextField
        onChange={event => {
          setSearchBoxValue(event.target.value)
        }}
        value={searchBoxValue}
        onKeyDown={handleKeyDown}
      />
      <List>
        {resultsList.map((result, index) => (
          <ListItem key={index} sx={{ backgroundColor: 'lightgray' }}>
            <ListItemButton>
              <ListItemText primary={`${result.name}, ${result.country}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
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

  return (
    <div>
      <MapContainer center={[latitude, longitude]} zoom={2} ref={mapRef} style={{ height: '50vh', width: '50vw' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker coord={markerCoordinates} setMarkerPos={setMarkerCoordinates} />
      </MapContainer>
      <p>
        Lat: {markerCoordinates ? markerCoordinates.lat : null} Lon: {markerCoordinates ? markerCoordinates.lng : null}
      </p>
      <LocationSearch />
    </div>
  )
}
