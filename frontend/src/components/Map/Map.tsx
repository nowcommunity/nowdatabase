import { useRef, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const DraggableMarker = ({ setMarkerPos, coord }: { setMarkerPos: any }) => {
  const [position, setPosition] = useState(coord)
  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
          console.log(marker.getLatLng())
          setMarkerPos(marker.getLatLng())
        }
      },
    }),
    [setMarkerPos]
  )

  return <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} />
}

export const Map = ({ coordinates, setCoordinates }) => {
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
      </MapContainer>
      <p>
        Lat: {coordinates ? coordinates.lat : null} Lon: {coordinates ? coordinates.lng : null}
      </p>
    </div>
  )
}
