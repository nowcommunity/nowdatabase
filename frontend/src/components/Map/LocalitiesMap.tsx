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

interface Props {
  localitiesQueryData?: Locality[]
  localitiesQueryIsFetching: boolean
}

type CustomMarkerOptions = L.MarkerOptions & { localityId: number }
type CustomMarker = L.Marker & { options: CustomMarkerOptions }

//  TODO: Don't do this
const markerIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII='

export const LocalitiesMap = ({ localitiesQueryData, localitiesQueryIsFetching }: Props) => {
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const markersRef = useRef<L.Layer | null>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [localityDetailsIsOpen, setLocalityDetailsIsOpen] = useState(false)
  const columnFilters = usePageContext()
  const {
    data: localityDetailsQueryData,
    isFetching: detailsLoading,
    error: detailsError,
  } = useGetLocalityDetailsQuery(selectedLocality ?? skipToken) // use skipToken to skip query when state is null

  // const {
  //   data: fossilsQueryData,
  //   isFetching: fossilsLoading,
  //   error: fossilsError,
  // } = useGetLocalitySpeciesListMutation([selectedLocality] ?? skipToken) // use skipToken to skip query when state is null

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
    L.control.scale({ position: 'bottomright' }).addTo(mapInstance)
    // Add a layer control to the map
    L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(mapInstance)

    return () => {
      leafletMapRef.current = null
      mapInstance.remove()
    }
  }, [])

  useEffect(() => {
    if (!map || localitiesQueryIsFetching) return

    if (markersRef.current) {
      map.removeLayer(markersRef.current)
      markersRef.current = null
    }
    // To prevent eslint from complaining about that 'markers' variable below:
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-call */

    /* eslint-disable @typescript-eslint/no-unsafe-member-access */

    // @ts-expect-error The marker cluster library is a plain javascript library
    // with no module exports that extends 'L' when imported
    const newMarkers: Layer = L.markerClusterGroup()

    const localityIds = columnFilters.idList as unknown as number[]
    const filterApplied = localityIds.length > 0 && localityIds.every(id => id === null)

    const validIds = localityIds.filter(id => typeof id === 'number')

    const filteredLocalities = !filterApplied
      ? localitiesQueryData?.filter(locality => validIds.includes(locality.lid))
      : localitiesQueryData

    filteredLocalities?.forEach(locality => {
      const options: CustomMarkerOptions = {
        icon: new Icon({ iconUrl: markerIcon, iconSize: [25, 41], iconAnchor: [12, 41] }),
        title: locality.loc_name,
        localityId: locality.lid,
      }

      const marker = L.marker([locality.dec_lat, locality.dec_long], options) as CustomMarker
      marker.on('click', () => {
        setSelectedLocality(marker.options.localityId.toString())
        setLocalityDetailsIsOpen(true)
      })

      newMarkers.addLayer(marker)
    })

    newMarkers.addTo(map)
    markersRef.current = newMarkers
  }, [localitiesQueryData, localitiesQueryIsFetching, columnFilters, map])

  useEffect(() => {
    if (!map) return
    const mapInstance = map

    const handleMapClick = () => {
      setSelectedLocality(null)
      setLocalityDetailsIsOpen(false)
    }
    mapInstance.on('click', handleMapClick)

    return () => {
      mapInstance.off('click', handleMapClick)
    }
  }, [map])

  document.title = 'Map'

  return (
    <>
      <article id="localities-map">
        <div id="map-container" className={isOpen ? 'open' : ''}>
          <div ref={mapRef} style={{ flex: 1 }} />
        </div>
        {!localitiesQueryIsFetching && (
          <div className="button-row">
            <Button variant="contained" startIcon={<MapIcon />} onClick={() => setIsOpen(v => !v)}>
              {isOpen ? 'Close' : 'Open'} map
            </Button>
          </div>
        )}
      </article>
      <LocalityInfo
        localityDetailsQueryData={localityDetailsQueryData}
        detailsLoading={detailsLoading}
        isOpen={localityDetailsIsOpen}
        onClose={() => {
          setLocalityDetailsIsOpen(false)
        }}
      />
    </>
  )
}
