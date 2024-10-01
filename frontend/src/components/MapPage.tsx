import { Map } from './Map/Map'
import { useState } from 'react'
import 'leaflet/dist/leaflet.css'

export const MapPage = () => {
  const [coordinates, setCoordinates] = useState(null)

  return <Map coordinates={coordinates} setCoordinates={setCoordinates} />
}
