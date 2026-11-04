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

const MapPlaceholder = () => (
  <article id="localities-map">
    <div className="map-container">
      <div className="map map-placeholder" />
    </div>
    <div className="open-button" />
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
        onOpen={() => setHasBeenOpened(true)}
      />
    </Suspense>
  )
}
