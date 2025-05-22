import { useGetAllLocalitiesQuery } from '../../redux/localityReducer'
import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L, { LatLngExpression } from 'leaflet'
import { borders } from './country_borders_WGS84'


export const LocalitiesMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const { data: localitiesQueryData, isFetching: localitiesQueryIsFetching } = useGetAllLocalitiesQuery()

  useEffect(() => {
    if (!mapRef.current || localitiesQueryIsFetching) return

    const map = L.map(mapRef.current)
    const coords: LatLngExpression = [15, 13]

    map.setView(coords, 2)
    
    // BASE MAPS  
    //// OpenTopoMap
    const topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    }).addTo(map);

    //// OpenStreetMap
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    })

    const baseMaps = {
      'OpenTopoMap': topomap,
      'OpenStreetMap': osm,
    };

    // LAYERS ON TOP OF BASE MAPS
    //// Add borders to the map
    const countryBorders = borders.forEach(poly => {
        L.polygon(poly, {color: 'gray', weight: 1,}).addTo(map);
    });

    //// Localities marker layer
    localitiesQueryData?.forEach(locality =>
      L.marker([locality.dec_lat, locality.dec_long]).addTo(map).bindPopup(locality.loc_name)
    )

    // Add a scale bar to the map
    L.control.scale({ position: 'bottomright' }).addTo(map)
    // Add a layer control to the map
    L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(map)


    return () => {
      map.remove()
    }
  }, [localitiesQueryData, localitiesQueryIsFetching])

  document.title = 'Map'

  return <div ref={mapRef} style={{ height: '500px' }}></div>
}
