import { useGetLocalityDetailsQuery } from '../../redux/localityReducer'
import { useState, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { borders } from './country_borders_WGS84'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import L, { LatLngExpression } from 'leaflet'
import { SimplifiedLocality } from '@/shared/types/data.js'
import { usePageContext } from '../Page'
import { skipToken } from '@reduxjs/toolkit/query'
import './leaflet.markercluster.js'
import './MarkerCluster.css'
import './MarkerCluster.Default.css'
import { SlidingModal } from './SlidingModal.tsx'
import { LocalityInfo } from './LocalityDetailsPanel.tsx'
import '../../styles/LocalitiesMap.css'
import northarrow from './images/north-arrow.png'

interface Props {
  localities?: SimplifiedLocality[]
  isFetching: boolean
}

type CustomCircleMarkerOptions = L.CircleMarkerOptions & { localityId: number }
type CustomCircleMarker = L.CircleMarker & { options: CustomCircleMarkerOptions }

export const LocalitiesMap = ({ localities, isFetching }: Props) => {
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [localityDetailsIsOpen, setLocalityDetailsIsOpen] = useState(false)
  const columnFilters = usePageContext()
  const [cluster, setCluster] = useState(true)

  const { data: localityDetailsQueryData, isFetching: detailsLoading } = useGetLocalityDetailsQuery(
    selectedLocality ?? skipToken
  ) // use skipToken to skip query when state is null

  useEffect(() => {
    if (!mapRef.current) return

    const mapInstance = L.map(mapRef.current, { maxZoom: 16 })
    setMap(mapInstance)

    const coords: LatLngExpression = [15, 13]
    mapInstance.setView(coords, 3)

    // BASE MAPS
    //// OpenTopoMap
    const topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
      noWrap: true,
    }).addTo(mapInstance)

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
      mapInstance.remove()
    }
  }, [])

  useEffect(() => {
    if (!map || isFetching) return

    // To prevent eslint from complaining about that 'markers' variable below:
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-call */

    /* eslint-disable @typescript-eslint/no-unsafe-member-access */

    // @ts-expect-error The marker cluster library is a plain javascript library
    // with no module exports that extends 'L' when imported
    const newMarkers: Layer = cluster ? L.markerClusterGroup() : L.layerGroup()

    localities?.forEach(locality => {
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
  }, [localities, isFetching, columnFilters, map, cluster])

  document.title = 'Map'

  return (
    <>
      <article id="localities-map">
        <div id="map-container" className={isOpen ? 'open' : ''}>
          <div className={'map'} ref={mapRef} style={{ flex: 1 }} />
          <button className="cluster-btn" onClick={() => setCluster(cluster => !cluster)}>
            {cluster ? 'Show individual' : 'Show cluster'}
          </button>
          <div id="blur-container" className={isOpen ? 'open' : ''}></div>
        </div>
        <div className="button-row">
          <ArrowUpwardIcon className={isOpen ? 'map-btn-up' : 'map-btn-down'} onClick={() => setIsOpen(v => !v)} />
        </div>
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
