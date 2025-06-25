import { useGetLocalitySpeciesListMutation } from '../../redux/localityReducer'
import { useState, useEffect } from 'react'
import { LocalityDetailsType } from '@/shared/types/data.js'
import { SpeciesTable } from './SpeciesTable'
import '../../styles/LocalityDetailsPanel.css'
import { Link } from 'react-router-dom'

interface Props {
  localityDetailsQueryData: LocalityDetailsType | undefined
  selectedLocality: string | null
  detailsLoading: boolean
}

export const LocalityInfo = ({ localityDetailsQueryData, selectedLocality, detailsLoading }: Props) => {
  const [getLocalitySpeciesList, { data, isLoading, isError }] = useGetLocalitySpeciesListMutation()
  const [fossils, setFossils] = useState<string[][] | null>(null)

  useEffect(() => {
    if (selectedLocality) {
      void getLocalitySpeciesList([Number(selectedLocality)])
    }
  }, [selectedLocality, getLocalitySpeciesList])

  useEffect(() => {
    if (data) {
      setFossils(data)
    }
  }, [data])

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading species data</p>
  if (!data) return null

  return (
    <>
      <div className="locality-details-panel">
        {detailsLoading || !localityDetailsQueryData ? (
          <p>Loading...</p>
        ) : (
          <div>
            <Link to={`/locality/${localityDetailsQueryData.lid}`}>
              <h2>{localityDetailsQueryData.loc_name}</h2>
            </Link>
            <p>
              <strong>ID:</strong> {localityDetailsQueryData.lid}
            </p>
            <p>
              <strong>Country:</strong> {localityDetailsQueryData.country}
            </p>
            <p>
              <strong>Age:</strong> {`${localityDetailsQueryData.max_age}, ${localityDetailsQueryData.min_age}`}
            </p>
            <p>
              <strong>Latitude & Longitude:</strong>{' '}
              {`${localityDetailsQueryData.dec_lat}, ${localityDetailsQueryData.dec_long}`}
            </p>
            <p>
              <strong>Taxa:</strong> {data.length - 1 < 0 ? 0 : data.length - 1}
            </p>
          </div>
        )}
      </div>
      {data ? <SpeciesTable data={fossils} /> : isLoading ? <div>Loading...</div> : <div>No data</div>}
    </>
  )
}
