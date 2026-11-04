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

const EmptyMap = ({ onOpen }: { onOpen?: () => void }) => (
  <article id="localities-map">
    <div className="map-container">
      <div className="map map-placeholder" />
      <div className="gradient" onClick={onOpen} data-cy="localities-map-placeholder"></div>
    </div>
    <div className="open-button" onClick={onOpen} title="Open map">
      <span className="downarrow"></span>
    </div>
  </article>
)

// Shows a lightweight empty map until the user opens it. The real map (Leaflet, country borders and
// one marker per locality) is only loaded and built after that.
export const LazyLocalitiesMap = ({ localities, isFetching }: Props) => {
  const [hasBeenOpened, setHasBeenOpened] = useState(false)

  if (!hasBeenOpened) return <EmptyMap onOpen={() => setHasBeenOpened(true)} />

  return (
    <Suspense fallback={<EmptyMap />}>
      <LocalitiesMap localities={localities} isFetching={isFetching} openOnMount />
    </Suspense>
  )
}
