import {
  useGetLocalityStatisticsQuery,
  useGetSpeciesStatisticsQuery,
  useGetStatisticsQuery,
} from '../redux/statisticsReducer'
import { ENV } from '@/util/config'
import { useEffect, useRef } from 'react'

import mapSvg from '../resource/map.svg'
import logo from '../resource/nowlogo.jpg'
import '../styles/FrontPage.css'

export const FrontPage = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const { data: statisticsQueryData } = useGetStatisticsQuery()
  const { data: speciesStatisticsQueryData, isFetching: speciesStatisticsQueryIsFetching } =
    useGetSpeciesStatisticsQuery()
  const { data: localityStatisticsQueryData, isFetching: localityStatisticsQueryIsFetching } =
    useGetLocalityStatisticsQuery()

  // Map hover effect
  useEffect(() => {
    if (!mapContainerRef.current) return
    mapContainerRef.current.onmousemove = (e: MouseEvent) => {
      if (!mapContainerRef.current) return
      const rect = mapContainerRef.current.getBoundingClientRect()
      const height = rect.bottom - rect.top
      const width = rect.right - rect.left

      mapContainerRef.current?.style.setProperty('--x', `${((e.clientX - rect.left) / width) * 100}%`)
      mapContainerRef.current?.style.setProperty('--y', `${((e.clientY - rect.top) / height) * 100}%`)
    }
  }, [])

  if (ENV === 'dev') {
    document.title = 'NOW Database (dev)'
  } else {
    document.title = 'NOW Database'
  }

  return (
    <main id="front-page">
      <header className="top-info">
        <div className="left">
          <h1>Welcome to NOW database</h1>
          <p>
            The NOW (New and Old Worlds) fossil mammal database contains information about Cenozoic land mammal taxa and
            localities. The emphasis of the database has been on the European Miocene and Pliocene but North American
            localities, covering the whole Cenozoic, were added to the public database in 2016. African localities are
            currently being added and updated, and the temporal scale is also becoming wider for both Eurasia and
            Africa, with Pleistocene and Paleogene localities being added into the database. The NOW database is
            maintained and coordinated by <a href="mailto:indre-dot-zliobaite-at-helsinki-dot-fi">Indrė Žliobaitė</a> in
            collaboration with associate coordinators, a steering group and an international{' '}
            <a href="https://nowdatabase.org/now/board/">advisory board</a>.
          </p>
          <p>
            <a href="https://nowdatabase.org/">See more information at nowdatabase.org</a>
          </p>
        </div>
        <div className="image-container">
          <img src={logo} alt="NOW database logo" />
          <span className="copyright">© Noira Martiskainen</span>
        </div>
      </header>
      <div className="stats">
        <span>
          <b>Localities</b> {statisticsQueryData && statisticsQueryData.localityCount}
        </span>
        <span>
          <b>Species</b> {statisticsQueryData && statisticsQueryData.speciesCount}
        </span>
        <span>
          <b>Locality-species</b> {statisticsQueryData && statisticsQueryData.localitySpeciesCount}
        </span>
      </div>
      <div className="map-container" ref={mapContainerRef}>
        <div className="map">
          <img src={mapSvg} />
        </div>
      </div>
      <section className="additional-info">
        <div>
          <h2>Statistics</h2>
          <div className="activity-stats">
            <div className="stat-table">
              <h3>Most localities</h3>
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Surname</th>
                  </tr>
                </thead>
                <tbody>
                  {!localityStatisticsQueryIsFetching &&
                    localityStatisticsQueryData &&
                    localityStatisticsQueryData.map((stat, i) => (
                      <tr key={i}>
                        <td>{stat.year}</td>
                        <td>{stat.month}</td>
                        <td>{stat.surname}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="stat-table">
              <h3>Most species</h3>
              <table>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Surname</th>
                  </tr>
                </thead>
                <tbody>
                  {!speciesStatisticsQueryIsFetching &&
                    speciesStatisticsQueryData &&
                    speciesStatisticsQueryData.map((stat, i) => (
                      <tr key={i}>
                        <td>{stat.year}</td>
                        <td>{stat.month}</td>
                        <td>{stat.surname}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <h2>Citation</h2>
          <h3>Minimum required attribution</h3>
          <p>
            Data (<a href="https://nowdatabase.org/now/database/">https://nowdatabase.org/now/database/</a>) by The NOW
            Community / CC BY 4.0.
          </p>
          <h3>Suggested citation or attribution</h3>
          <p>
            The NOW Community [year]. New and Old Worlds Database of Fossil Mammals (NOW). Licensed under CC BY 4.0.
            Retrieved [download date] from{' '}
          </p>
          <a href="https://nowdatabase.org/now/database/">https://nowdatabase.org/now/database/</a>.<h3>DOI</h3>{' '}
          <a href="http://doi.org/10.5281/zenodo.4268068">doi:10.5281/zenodo.4268068</a>.
        </div>
      </section>
    </main>
  )
}
