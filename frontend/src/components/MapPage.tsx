import { useGetAllLocalitiesQuery } from '../redux/localityReducer'
import { LocalitiesMap } from './Map/LocalitiesMap'
import 'leaflet/dist/leaflet.css'

export const MapPage = () => {
  const { data: localitiesData, isFetching: localitiesIsFetching } = useGetAllLocalitiesQuery()
  return localitiesData && !localitiesIsFetching && <LocalitiesMap localities={localitiesData} />
}
