import { useEffect, useRef, useState } from 'react'

import { Button } from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import L, { LatLngExpression } from 'leaflet'
import { Locality } from '@/shared/types/data.js'

import './leaflet.markercluster.js'
import './MarkerCluster.css'
import './MarkerCluster.Default.css'

import '../../styles/LocalityMap.css'

interface Props {
  localitiesQueryData?: Locality[]
  localitiesQueryIsFetching: boolean
}

export const LocalitiesMap = ({ localitiesQueryData, localitiesQueryIsFetching }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!mapRef.current || localitiesQueryIsFetching) return

    const map = L.map(mapRef.current, { maxZoom: 16 })
    const coords: LatLngExpression = [60.204637, 24.962123]

    // To prevent eslint from complaining about that 'markers' variable below:
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */

    // @ts-expect-error The marker cluster library is a plain javascript library
    // with no module exports that extends 'L' when imported.
    const markers: Layer = L.markerClusterGroup()

    localitiesQueryData?.forEach(locality => markers.addLayer(L.marker([locality.dec_lat, locality.dec_long])))

    markers.addTo(map)

    map.setView(coords, 2)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    }).addTo(map)

    return () => {
      map.remove()
    }
  }, [localitiesQueryData, localitiesQueryIsFetching])

  document.title = 'Map'

  return (
    <article id="localities-map">
      <div id="map-container" className={isOpen ? 'open' : ''}>
        <div ref={mapRef}></div>
      </div>

      {!localitiesQueryIsFetching && (
        <div className="button-row">
          <Button variant="contained" startIcon={<MapIcon />} onClick={() => setIsOpen(v => !v)}>
            {isOpen ? 'Close' : 'Open'} map
          </Button>
        </div>
      )}
    </article>
  )
}
