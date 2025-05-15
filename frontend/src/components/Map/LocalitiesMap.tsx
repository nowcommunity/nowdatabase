import { useGetAllLocalitiesQuery } from '../../redux/localityReducer'
import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L, { LatLngExpression } from 'leaflet'

export const LocalitiesMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const { data: localitiesQueryData, isFetching: localitiesQueryIsFetching } = useGetAllLocalitiesQuery()

  useEffect(() => {
    if (!mapRef.current || localitiesQueryIsFetching) return

    const map = L.map(mapRef.current)
    const coords: LatLngExpression = [60.204637, 24.962123]

    map.setView(coords, 2)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    }).addTo(map)

    localitiesQueryData?.forEach(locality =>
      L.marker([locality.dec_lat, locality.dec_long]).addTo(map).bindPopup(locality.loc_name)
    )
    console.log(localitiesQueryData)

    return () => {
      map.remove()
    }
  }, [localitiesQueryData, localitiesQueryIsFetching])

  document.title = 'Map'

  return <div ref={mapRef} style={{ height: '500px' }}></div>
}
