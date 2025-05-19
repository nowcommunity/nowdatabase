import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L, { LatLngExpression } from 'leaflet'
import { Locality } from '@/shared/types'

interface Props {
  localities: Locality[]
}

export const LocalitiesMap = ({ localities }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current)
    const coords: LatLngExpression = [60.204637, 24.962123]

    map.setView(coords, 2)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    }).addTo(map)

    localities.forEach(locality =>
      L.marker([locality.dec_lat, locality.dec_long]).addTo(map).bindPopup(locality.loc_name)
    )
    return () => {
      map.remove()
    }
  }, [localities])

  document.title = 'Map'

  return <div ref={mapRef} style={{ height: '500px' }}></div>
}
