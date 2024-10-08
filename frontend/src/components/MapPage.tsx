import { Map } from './Map/Map'
import { useState } from 'react'
import 'leaflet/dist/leaflet.css'

export const MapPage = () => {
  const [coordinates, setCoordinates] = useState({ lat: 60.202665856, lng: 24.957662836 })

  return <Map coordinates={coordinates} setCoordinates={setCoordinates} />
}
