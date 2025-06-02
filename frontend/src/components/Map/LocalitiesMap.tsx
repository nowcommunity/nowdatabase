import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { borders } from './country_borders_WGS84'

import { Button } from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import L, { LatLngExpression, Icon } from 'leaflet'
import { Locality } from '@/shared/types/data.js'
import { usePageContext } from '../Page'

import './leaflet.markercluster.js'
import './MarkerCluster.css'
import './MarkerCluster.Default.css'

import '../../styles/LocalityMap.css'
import { markerIcon } from './mapResources.js'

interface Props {
  localitiesQueryData?: Locality[]
  localitiesQueryIsFetching: boolean
}

export const LocalitiesMap = ({ localitiesQueryData, localitiesQueryIsFetching }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const columnFilters = usePageContext()

  useEffect(() => {
    if (!mapRef.current || localitiesQueryIsFetching) return

    const map = L.map(mapRef.current, { maxZoom: 16 })
    const coords: LatLngExpression = [15, 13]

    // To prevent eslint from complaining about that 'markers' variable below:
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */

    // @ts-expect-error The marker cluster library is a plain javascript library
    // with no module exports that extends 'L' when imported
    const markers: Layer = L.markerClusterGroup()

    const localityIds = columnFilters.idList as unknown as number[]
    const filterApplied = localityIds.length > 0 && localityIds.every(id => id === null)

    const validIds = localityIds.filter(id => typeof id === 'number')

    const filteredLocalities = !filterApplied
      ? localitiesQueryData?.filter(locality => validIds.includes(locality.lid))
      : localitiesQueryData

    filteredLocalities?.forEach(locality =>
      markers.addLayer(
        L.marker([locality.dec_lat, locality.dec_long], {
          icon: new Icon({ iconUrl: markerIcon, iconSize: [25, 41], iconAnchor: [12, 41] }),
        })
      )
    )

    markers.addTo(map)

    map.setView(coords, 2)

    // BASE MAPS
    //// OpenTopoMap
    const topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
      noWrap: true,
    }).addTo(map)

    //// OpenStreetMap
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    })

    // LAYERS ON TOP OF BASE MAPS
    //// Add borders to the map
    borders.forEach(poly => {
      L.polygon(poly as LatLngExpression[], { color: 'gray', weight: 1 }).addTo(map)
    })

    // create a polygon layer for the country borders that is in layer control panel
    const borderLayer = L.layerGroup()
    borders.forEach(country_border => {
      const polygon = L.polygon(country_border as LatLngExpression[], {
        color: '#136f94',
        fillOpacity: 0.3,
        weight: 1,
      })
      borderLayer.addLayer(polygon)
    })

    const baseMaps = {
      OpenTopoMap: topomap,
      OpenStreetMap: osm,
      Countries: borderLayer,
    }

    // Add a scale bar to the map
    L.control.scale({ position: 'bottomright' }).addTo(map)
    // Add a layer control to the map
    L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(map)

    return () => {
      map.remove()
    }
  }, [localitiesQueryData, localitiesQueryIsFetching, columnFilters])

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
