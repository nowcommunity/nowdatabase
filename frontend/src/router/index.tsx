import { Navigate, createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { Login } from '../components/Login'
import { EmailPage } from '../components/EmailPage'
import {
  crossSearchPage,
  frontPage,
  localityPage,
  museumPage,
  personPage,
  projectPage,
  referencePage,
  regionPage,
  speciesPage,
  timeBoundPage,
  timeUnitPage,
} from '../components/pages'
import { ProjectNewPage } from '../pages/ProjectNewPage'
import { ProjectEditPage } from '../pages/projects/ProjectEditPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: frontPage },
      { path: 'occurrence/:lid/:speciesId', element: crossSearchPage },
      { path: 'occurrence/:id', element: <Navigate to="/occurrence" replace /> },
      { path: 'occurrence', element: crossSearchPage },
      { path: 'crosssearch/:id?', element: crossSearchPage },
      { path: 'locality/:id?', element: localityPage },
      { path: 'species/:id?', element: speciesPage },
      { path: 'museum/:id?', element: museumPage },
      { path: 'reference/:id?', element: referencePage },
      { path: 'time-unit/:id?', element: timeUnitPage },
      { path: 'time-bound/:id?', element: timeBoundPage },
      { path: 'region/:id?', element: regionPage },
      { path: 'person/:id?', element: personPage },
      { path: 'project/new', element: <ProjectNewPage /> },
      { path: 'project/:id/edit', element: <ProjectEditPage /> },
      { path: 'project/:id?', element: projectPage },
      { path: 'email', element: <EmailPage /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <div>Page not found.</div> },
    ],
  },
])

export default router
