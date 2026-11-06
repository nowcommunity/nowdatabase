import { lazy, Suspense, useState } from 'react'
import { SimplifiedLocality } from '../../shared/types/data.js'
import '../../styles/LocalitiesMap.css'

const LocalitiesMap = lazy(async () => {
  const module = await import('./LocalitiesMap')
  return { default: module.LocalitiesMap }
})

type Props = {
  localities?: SimplifiedLocality[]
  isFetching: boolean
}

const MapPlaceholder = ({ onOpen }: { onOpen?: () => void }) => (
  <article id="localities-map">
    <div className="map-container">
      <div className="map map-placeholder" />
    </div>
    {onOpen ? (
      <button className="open-button" onClick={onOpen} title="Open map" type="button">
        <span className="downarrow" />
      </button>
    ) : (
      <div className="open-button" />
    )}
  </article>
)

// Shows the base map right away, but the localities (one marker each) and country borders are only
// added after the user has opened the map.
export const LazyLocalitiesMap = ({ localities, isFetching }: Props) => {
  const [hasBeenOpened, setHasBeenOpened] = useState(false)

  return (
    <Suspense fallback={<MapPlaceholder />}>
      <LocalitiesMap
        localities={localities}
        isFetching={isFetching}
        loadLayers={hasBeenOpened}
        initiallyOpen={false}
        onOpen={() => setHasBeenOpened(true)}
      />
    </Suspense>
  )
}
