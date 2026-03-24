import { Navigate, createBrowserRouter } from 'react-router-dom'
import App from '../App'

const loadPagesElement = async (
  key:
    | 'crossSearchPage'
    | 'localityPage'
    | 'museumPage'
    | 'personPage'
    | 'projectPage'
    | 'referencePage'
    | 'regionPage'
    | 'speciesPage'
    | 'timeBoundPage'
    | 'timeUnitPage'
) => {
  const pagesModule = await import('../components/pages')

  return {
    Component: () => pagesModule[key],
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { FrontPage } = await import('../components/FrontPage')
          return { Component: FrontPage }
        },
      },
      { path: 'occurrence/:lid/:speciesId', lazy: () => loadPagesElement('crossSearchPage') },
      { path: 'occurrence/:id', element: <Navigate to="/occurrence" replace /> },
      { path: 'occurrence', lazy: () => loadPagesElement('crossSearchPage') },
      { path: 'crosssearch/:id?', lazy: () => loadPagesElement('crossSearchPage') },
      { path: 'locality/:id?', lazy: () => loadPagesElement('localityPage') },
      { path: 'species/:id?', lazy: () => loadPagesElement('speciesPage') },
      { path: 'museum/:id?', lazy: () => loadPagesElement('museumPage') },
      { path: 'reference/:id?', lazy: () => loadPagesElement('referencePage') },
      { path: 'time-unit/:id?', lazy: () => loadPagesElement('timeUnitPage') },
      { path: 'time-bound/:id?', lazy: () => loadPagesElement('timeBoundPage') },
      { path: 'region/:id?', lazy: () => loadPagesElement('regionPage') },
      { path: 'person/:id?', lazy: () => loadPagesElement('personPage') },
      {
        path: 'project/new',
        lazy: async () => {
          const { ProjectNewPage } = await import('../pages/ProjectNewPage')
          return { Component: ProjectNewPage }
        },
      },
      {
        path: 'project/:id/edit',
        lazy: async () => {
          const { ProjectEditPage } = await import('../pages/projects/ProjectEditPage')
          return { Component: ProjectEditPage }
        },
      },
      { path: 'project/:id?', lazy: () => loadPagesElement('projectPage') },
      {
        path: 'email',
        lazy: async () => {
          const { EmailPage } = await import('../components/EmailPage')
          return { Component: EmailPage }
        },
      },
      {
        path: 'login',
        lazy: async () => {
          const { Login } = await import('../components/Login')
          return { Component: Login }
        },
      },
      { path: '*', element: <div>Page not found.</div> },
    ],
  },
])

export default router
