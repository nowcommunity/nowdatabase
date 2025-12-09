import { LocalityDetailsType } from '@/shared/types/data.js'
import { SpeciesTable } from './SpeciesTable'
import '../../styles/LocalityDetailsPanel.css'
import { Link } from 'react-router-dom'

interface Props {
  localityDetailsQueryData: LocalityDetailsType | undefined
  detailsLoading: boolean
}

export const LocalityInfo = ({ localityDetailsQueryData, detailsLoading }: Props) => {
  if (detailsLoading) return <p>Loading...</p>
  if (!localityDetailsQueryData) return null

  return (
    <>
      <div className="locality-details-panel">
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
            <strong>Taxa:</strong> {localityDetailsQueryData.now_ls.length}
          </p>
        </div>
      </div>
      {localityDetailsQueryData ? <SpeciesTable data={localityDetailsQueryData.now_ls} /> : <div>No data</div>}
    </>
  )
}
