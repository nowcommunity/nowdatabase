import { useRef, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/assets/css/leaflet.css'

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

const SearchField = () => {
  const provider = new OpenStreetMapProvider()

  const searchControl = new GeoSearchControl({
    provider: provider,
    autoComplete: false,
  })

  const map = useMap()
  useEffect(() => {
    map.addControl(searchControl)
    return () => map.removeControl(searchControl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export const Map = ({ coordinates, setCoordinates }: { coordinates: Coordinate; setCoordinates: CoordinateSetter }) => {
  const mapRef = useRef(null)
  const latitude = 30
  const longitude = -5
  document.title = 'Map'

  return (
    <div>
      <MapContainer center={[latitude, longitude]} zoom={2} ref={mapRef} style={{ height: '50vh', width: '50vw' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker coord={coordinates} setMarkerPos={setCoordinates} />
        <SearchField />
      </MapContainer>
      <p>
        Lat: {coordinates ? coordinates.lat : null} Lon: {coordinates ? coordinates.lng : null}
      </p>
    </div>
  )
}
