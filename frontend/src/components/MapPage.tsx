import { useRef } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export const MapPage = () => {
  const mapRef = useRef(null)
  const latitude = 30
  const longitude = -5

  document.title = 'Map'

  return (
    <MapContainer center={[latitude, longitude]} zoom={2} ref={mapRef} style={{ height: '50vh', width: '50vw' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Additional map layers or components can be added here */}
    </MapContainer>
  )
}
