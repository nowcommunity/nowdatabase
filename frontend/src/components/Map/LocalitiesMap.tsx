import {
  useGetAllLocalitiesQuery,
  useGetLocalityDetailsQuery,
  useGetLocalitySpeciesListMutation,
} from '../../redux/localityReducer'
import { useState, useEffect, useRef, Fragment } from 'react'
import 'leaflet/dist/leaflet.css'
import L, { LatLngExpression, Marker, Icon } from 'leaflet'
import { borders } from './country_borders_WGS84'
import { Button } from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import { Locality } from '@/shared/types/data.js'
import { usePageContext } from '../Page'
import { skipToken } from '@reduxjs/toolkit/query'
import './leaflet.markercluster.js'
import './MarkerCluster.css'
import './MarkerCluster.Default.css'
import { SlidingModal } from './SlidingModal.tsx'
import { LocalityInfo } from './LocalityDetailsPanel.tsx'
import '../../styles/LocalityMap.css'
import northarrow from './images/north-arrow.png'

interface Props {
  localitiesQueryData?: Locality[]
  localitiesQueryIsFetching: boolean
}

type CustomCircleMarkerOptions = L.CircleMarkerOptions & { localityId: number }
type CustomCircleMarker = L.CircleMarker & { options: CustomCircleMarkerOptions }

export const LocalitiesMap = ({ localitiesQueryData, localitiesQueryIsFetching }: Props) => {
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [localityDetailsIsOpen, setLocalityDetailsIsOpen] = useState(false)
  const columnFilters = usePageContext()
  const [cluster, setCluster] = useState(true)

  const {
    data: localityDetailsQueryData,
    isFetching: detailsLoading,
    error: detailsError,
  } = useGetLocalityDetailsQuery(selectedLocality ?? skipToken) // use skipToken to skip query when state is null

  useEffect(() => {
    if (!mapRef.current) return

    const mapInstance = L.map(mapRef.current, { maxZoom: 16 })
    setMap(mapInstance)

    const coords: LatLngExpression = [15, 13]
    mapInstance.setView(coords, 2)

    // BASE MAPS
    //// OpenTopoMap
    const topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
      noWrap: true,
    }).addTo(mapInstance)

    leafletMapRef.current = map
    //// OpenStreetMap
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    })

    // LAYERS ON TOP OF BASE MAPS
    //// Add borders to the map
    borders.forEach(poly => {
      L.polygon(poly as LatLngExpression[], { color: 'gray', weight: 1 }).addTo(mapInstance)
    })

    // create a polygon layer for the country borders that is in layer control panel..
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
    L.control.scale({ position: 'bottomright' }).addTo(mapInstance)

    //Add a layer control to the map
    L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(mapInstance)

    // Add north-arrow to the map
    const northArrowControl = L.Control.extend({
      onAdd: function () {
        const img = L.DomUtil.create('img')
        img.src = northarrow
        img.style.width = '40px'
        return img
      },
    })

    const northArrow = new northArrowControl({ position: 'bottomright' })
    northArrow.addTo(mapInstance)

    return () => {
      leafletMapRef.current = null
      mapInstance.remove()
    }
  }, [])

  useEffect(() => {
    if (!map || localitiesQueryIsFetching) return

    // To prevent eslint from complaining about that 'markers' variable below:
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-call */

    /* eslint-disable @typescript-eslint/no-unsafe-member-access */

    // @ts-expect-error The marker cluster library is a plain javascript library
    // with no module exports that extends 'L' when imported
    const newMarkers: Layer = cluster ? L.markerClusterGroup() : L.layerGroup()

    const localityIds = columnFilters.idList as unknown as number[]
    const filterApplied = localityIds.length > 0 && localityIds.every(id => id === null)

    const validIds = localityIds.filter(id => typeof id === 'number')

    const filteredLocalities = !filterApplied
      ? localitiesQueryData?.filter(locality => validIds.includes(locality.lid))
      : localitiesQueryData

    filteredLocalities?.forEach(locality => {
      const options: CustomCircleMarkerOptions = {
        localityId: locality.lid,
        radius: 4,
        color: '#db2c2c',
        fillColor: '#d95050',
      }

      const marker = L.circleMarker([locality.dec_lat, locality.dec_long], options) as CustomCircleMarker

      marker
        .on('click', () => {
          setSelectedLocality(marker.options.localityId.toString())
          setLocalityDetailsIsOpen(true)
        })
        .bindTooltip(locality.loc_name)

      newMarkers.addLayer(marker)
    })

    // hot reload fix
    try {
      newMarkers.addTo(map)
    } catch (e) {
      return () => {}
    }

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      map.removeLayer(newMarkers)
    }
  }, [localitiesQueryData, localitiesQueryIsFetching, columnFilters, map, cluster])

  document.title = 'Map'

  return (
    <>
      <article id="localities-map">
        <div id="map-container" className={isOpen ? 'open' : ''}>
          <div ref={mapRef} style={{ flex: 1 }} />
          {isOpen && (
            <button className="cluster-btn" onClick={() => setCluster(cluster => !cluster)}>
              {cluster ? 'Individual' : 'Cluster'}
            </button>
          )}
        </div>
        {!localitiesQueryIsFetching && localitiesQueryData && (
          <div className="button-row">
            <Button variant="contained" startIcon={<MapIcon />} onClick={() => setIsOpen(v => !v)}>
              {isOpen ? 'Close' : 'Open'} map
            </Button>
          </div>
        )}
      </article>
      <SlidingModal isOpen={localityDetailsIsOpen} onClose={() => setLocalityDetailsIsOpen(false)}>
        <LocalityInfo
          localityDetailsQueryData={localityDetailsQueryData}
          detailsLoading={detailsLoading}
          selectedLocality={selectedLocality}
        />
      </SlidingModal>
    </>
  )
}
