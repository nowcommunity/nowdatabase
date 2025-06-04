import { Locality, LocalityDetailsType } from '@/shared/types/data.js'
import { SpeciesTable } from './SpeciesTable'

interface Props {
  localityDetailsQueryData: LocalityDetailsType | undefined
  detailsLoading: boolean
}

export const LocalityInfo = ({ localityDetailsQueryData, detailsLoading }: Props) => {
  const test = 'data...'

  return (
    <>
      <div
        style={{
          width: '300px',
          padding: '1rem',
          borderLeft: '1px solid #ccc',
          overflowY: 'auto',
        }}
      >
        {detailsLoading || !localityDetailsQueryData ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2>{localityDetailsQueryData.loc_name}</h2>
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
              <strong>Taxa:</strong>
            </p>
          </div>
        )}
      </div>
      <SpeciesTable data={test} />
    </>
  )
}
