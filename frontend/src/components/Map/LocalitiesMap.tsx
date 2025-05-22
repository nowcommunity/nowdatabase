import { useGetAllLocalitiesQuery, useGetLocalityDetailsQuery } from '../../redux/localityReducer'
import { useState, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L, { LatLngExpression, Marker } from 'leaflet'

type CustomMarkerOptions = L.MarkerOptions & { localityId: number }
type CustomMarker = L.Marker & { options: CustomMarkerOptions }

export const LocalitiesMap = () => {
  // use null instead?
  const [selectedLocality, setSelectedLocality] = useState<number>(0)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const { data: localitiesQueryData, isFetching: localitiesQueryIsFetching } = useGetAllLocalitiesQuery()

  const {
    data: localityDetailsQueryData,
    isFetching: detailsLoading,
    error,
  } = useGetLocalityDetailsQuery(selectedLocality?.toString(), { skip: !selectedLocality })

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return
    const map = L.map(mapRef.current)
    const coords: LatLngExpression = [60.204637, 24.962123]

    map.setView(coords, 2)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    }).addTo(map)

    leafletMapRef.current = map

    return () => {
      map.remove()
      leafletMapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!leafletMapRef.current || !localitiesQueryData || localitiesQueryIsFetching) return

    localitiesQueryData.forEach(locality => {
      const options: CustomMarkerOptions = {
        title: locality.loc_name,
        localityId: locality.lid,
      }

      const marker = L.marker([locality.dec_lat, locality.dec_long], options) as CustomMarker
      marker.addTo(leafletMapRef.current!).bindPopup(locality.loc_name)

      marker.on('click', () => {
        setSelectedLocality(marker.options.localityId)
        console.log('Clicked marker with ID:', marker.options.localityId)
        console.log('State updated with locality ID:', selectedLocality)
      })
    })
  }, [localitiesQueryData, localitiesQueryIsFetching, selectedLocality])

  useEffect(() => {
    if (localityDetailsQueryData) {
      console.log('Fetched locality details:', localityDetailsQueryData)
    }
  })

  document.title = 'Map'

  return <div ref={mapRef} style={{ height: '500px' }}></div>
}
