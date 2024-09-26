import { useRef, useState, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const DraggableMarker = ({ setMarkerPos }: { setMarkerPos: any }) => {
  const center = {
    lat: 61.5,
    lng: 25.01,
  }
  const [draggable, setDraggable] = useState(false)
  const [position, setPosition] = useState(center)
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
    []
  )
  const toggleDraggable = useCallback(() => {
    setDraggable(d => !d)
  }, [])

  return (
    <Marker draggable={draggable} eventHandlers={eventHandlers} position={position} ref={markerRef}>
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable ? 'Marker is draggable' : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  )
}

export const Map = () => {
  const mapRef = useRef(null)
  const latitude = 30
  const longitude = -5

  document.title = 'Map'

  const [markerPos, setMarkerPos] = useState(null)

  return (
    <div>
      <MapContainer center={[latitude, longitude]} zoom={2} ref={mapRef} style={{ height: '50vh', width: '50vw' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Additional map layers or components can be added here */}
        {/* <LocationMarker /> */}
        <DraggableMarker setMarkerPos={setMarkerPos} />
      </MapContainer>
      <p>
        Lat: {markerPos ? markerPos.lat : null} Lon: {markerPos ? markerPos.lng : null}
      </p>
    </div>
  )
}
