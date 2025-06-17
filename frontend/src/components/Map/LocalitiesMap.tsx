import { useGetLocalityDetailsQuery } from '../../redux/localityReducer'
import { useState, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { countryPolygons } from '../../country_data/countryPolygons.ts'
import { countryBoundingBoxes } from '../../country_data/countryBoundingBoxes.ts'
import L, { LatLngExpression } from 'leaflet'
import { SimplifiedLocality } from '@/shared/types/data.js'
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
  const [clusteringEnabled, setClusteringEnabled] = useState(true)

  // Use skipToken to skip query when state is null
  const { data: localityDetailsQueryData, isFetching: detailsLoading } = useGetLocalityDetailsQuery(
    selectedLocality ?? skipToken
  )

  useEffect(() => {
    if (!mapRef.current) return

    const mapInstance = L.map(mapRef.current, { maxZoom: 16 })
    setMap(mapInstance)

    const coords: LatLngExpression = [15, 13]
    mapInstance.setView(coords, 3)

    // ---- Base maps ----

    // OpenTopoMap
    const topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
      noWrap: true,
    }).addTo(mapInstance)

    // OpenStreetMap
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    })

    // ---- Layers on top of base maps ----

    // Create a polygon layer for the country borders that is in layer control panel.
    const borderLayer = L.layerGroup()
    countryPolygons.forEach(countryBorder => {
      L.polygon(countryBorder as LatLngExpression[], { color: 'gray', weight: 1 }).addTo(mapInstance)

      const polygon = L.polygon(countryBorder as LatLngExpression[], {
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

    // Scale bar
    L.control.scale({ position: 'bottomright' }).addTo(mapInstance)

    // Layer control
    L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(mapInstance)

    // North-arrow
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
    const newMarkers: Layer = clusteringEnabled ? L.markerClusterGroup() : L.layerGroup()

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
  }, [localities, isFetching, map, clusteringEnabled])

  document.title = 'Map'

  return (
    <>
      <article id="localities-map" className={isOpen ? 'open' : ''}>
        <div className="map-container">
          <div className="map" ref={mapRef} />
          <button className="cluster" onClick={() => setClusteringEnabled(cluster => !cluster)}>
            {clusteringEnabled ? 'Show individual' : 'Show cluster'}
          </button>
          <div className="gradient" onClick={() => setIsOpen(v => !v)}></div>
        </div>
        <div className="open-button" onClick={() => setIsOpen(v => !v)} title="Close map">
          <span className="downarrow"></span>
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
