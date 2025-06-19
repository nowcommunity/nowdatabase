import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { countryPolygons } from '../../country_data/countryPolygons.ts'
import L, { LatLngExpression } from 'leaflet'
import '../../styles/SingleLocalityMap.css'
import northarrow from './images/north-arrow.png'
import { CountryBoundingBox } from '@/country_data/countryBoundingBoxes.ts'

interface Props {
  decLat?: number
  decLong?: number
  boxes?: CountryBoundingBox[]
}

export const SingleLocalityMap = ({ decLat, decLong, boxes }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || !decLat || !decLong) return

    const mapInstance = L.map(mapRef.current, { maxZoom: 16 })
    setMap(mapInstance)

    const coords: LatLngExpression = [decLat, decLong]
    mapInstance.setView(coords, 4)

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

    // Create a polygon layer for the country borders that is in layer control panel..
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

    // Add a scale bar to the map
    L.control.scale({ position: 'bottomright' }).addTo(mapInstance)

    // Add a layer control to the map
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
  }, [decLat, decLong])

  useEffect(() => {
    if (!map || !decLat || !decLong) return

    if (boxes) {
      boxes.forEach(box => {
        L.polygon(
          [
            [box.top, box.left],
            [box.top, box.right],
            [box.bottom, box.right],
            [box.bottom, box.left],
          ] as LatLngExpression[],
          { color: 'blue' }
        ).addTo(map)
      })
    }

    const newMarker = L.layerGroup()

    newMarker.addLayer(
      L.circleMarker([decLat, decLong], {
        radius: 4,
        color: '#db2c2c',
        fillColor: '#d95050',
      })
    )

    // hot reload fix
    try {
      newMarker.addTo(map)
    } catch (e) {
      return () => {}
    }

    return () => {
      map.removeLayer(newMarker)
    }
  }, [map, decLat, decLong])

  document.title = 'Map'

  return (
    <article id="locality-map">
      <div className={'map-locality-container'}>
        <div ref={mapRef}></div>
      </div>
    </article>
  )
}
