import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L, { LatLngExpression } from 'leaflet'

export const LocalitiesMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current)
    const coords: LatLngExpression = [60.204637, 24.962123]

    map.setView(coords, 4)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    L.marker(coords).addTo(map).bindPopup('You are here').openPopup()

    return () => {
      map.remove()
    }
  }, [])

  document.title = 'Map'

  return <div ref={mapRef} style={{ height: '500px' }}></div>
}
