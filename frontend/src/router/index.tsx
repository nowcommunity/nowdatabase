import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { RouterError } from '../components/ErrorBoundary/RouterError'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouterError />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { FrontPage } = await import('../pages/FrontPage')
          return { Component: FrontPage }
        },
      },
      {
        path: 'locality/:id?',
        lazy: async () => {
          const { LocalityPage } = await import('../pages/LocalityPage')
          return { Component: LocalityPage }
        },
      },
      {
        path: 'species/:id?',
        lazy: async () => {
          const { SpeciesPage } = await import('../pages/SpeciesPage')
          return { Component: SpeciesPage }
        },
      },
      {
        path: 'occurrence/:lid/:speciesId',
        lazy: async () => {
          const { OccurrencesPage } = await import('../pages/OccurrencesPage')
          return { Component: OccurrencesPage }
        },
      },
      {
        path: 'occurrence/:id',
        // Matches occurrence/new
        lazy: async () => {
          const { OccurrencesPage } = await import('../pages/OccurrencesPage')
          return { Component: OccurrencesPage }
        },
      },
      {
        path: 'occurrence',
        lazy: async () => {
          const { OccurrencesPage } = await import('../pages/OccurrencesPage')
          return { Component: OccurrencesPage }
        },
      },
      {
        path: 'museum/:id?',
        lazy: async () => {
          const { MuseumPage } = await import('../pages/MuseumPage')
          return { Component: MuseumPage }
        },
      },
      {
        path: 'reference/:id?',
        lazy: async () => {
          const { ReferencePage } = await import('../pages/ReferencePage')
          return { Component: ReferencePage }
        },
      },
      {
        path: 'time-unit/:id?',
        lazy: async () => {
          const { TimeUnitPage } = await import('../pages/TimeUnitPage')
          return { Component: TimeUnitPage }
        },
      },
      {
        path: 'time-bound/:id?',
        lazy: async () => {
          const { TimeBoundPage } = await import('../pages/TimeBoundPage')
          return { Component: TimeBoundPage }
        },
      },
      {
        path: 'region/:id?',
        lazy: async () => {
          const { RegionPage } = await import('../pages/RegionPage')
          return { Component: RegionPage }
        },
      },
      {
        path: 'person/:id?',
        lazy: async () => {
          const { PersonPage } = await import('../pages/PersonPage')
          return { Component: PersonPage }
        },
      },
      {
        path: 'project/:id?',
        lazy: async () => {
          const { ProjectPage } = await import('../pages/ProjectPage')
          return { Component: ProjectPage }
        },
      },
      {
        path: 'project/new',
        lazy: async () => {
          const { ProjectNewPage } = await import('../pages/ProjectNewPage')
          return { Component: ProjectNewPage }
        },
      },
      {
        path: 'email',
        lazy: async () => {
          const { EmailPage } = await import('../components/EmailPage')
          return { Component: EmailPage }
        },
      },
      {
        path: 'admin/merge-species',
        lazy: async () => {
          const { SpeciesMergePage } = await import('../pages/admin/SpeciesMergePage')
          return { Component: SpeciesMergePage }
        },
      },
      {
        path: 'admin/emergency-shutdown',
        lazy: async () => {
          const { EmergencyShutdownPage } = await import('../pages/admin/EmergencyShutdownPage')
          return { Component: EmergencyShutdownPage }
        },
      },
      {
        path: 'login',
        lazy: async () => {
          const { Login } = await import('../components/Login')
          return { Component: Login }
        },
      },
      {
        path: 'maintenance',
        lazy: async () => {
          const { MaintenancePage } = await import('../pages/MaintenancePage')
          return { Component: MaintenancePage }
        },
      },
      { path: '*', element: <div>Page not found.</div> },
    ],
  },
])

export default router
