import { Container, Grid } from '@mui/material'
import { FrontPage } from './components/FrontPage'
import { NavBar } from './components/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProjectTable } from './components/Project/ProjectTable'
import { ProjectDetails } from './components/Project/ProjectDetails'
import { RegionTable } from './components/Region/RegionTable'
import { RegionDetails } from './components/Region/RegionDetails'
import { Login } from './components/Login'
import { localityPage, referencePage, speciesPage, timeBoundPage, timeUnitPage } from './components/pages'

const App = () => {
  return (
    <BrowserRouter>
      <Grid container>
        <Grid item xs={12}>
          <Container maxWidth="xl">
            <NavBar />
          </Container>
        </Grid>
        <Container maxWidth="xl" fixed style={{ marginTop: '2em', marginBottom: '2em' }}>
          <Grid item>
            <Routes>
              <Route element={localityPage} path="/locality/:id?" />
              <Route element={speciesPage} path="/species/:id?" />
              <Route element={referencePage} path="/reference/:id?" />
              <Route element={timeUnitPage} path="/time-unit/:id?" />
              <Route element={timeBoundPage} path="/time-bound/:id?" />
              <Route element={<ProjectTable />} path="/project/" />
              <Route element={<ProjectDetails />} path="/project/:id" />
              <Route element={<RegionTable />} path="/region/" />
              <Route element={<RegionDetails />} path="/region/:id" />
              <Route element={<FrontPage />} path="/" />
              <Route element={<Login />} path="/login" />
              <Route element={<div>Page not found.</div>} path="*" />
            </Routes>
          </Grid>
        </Container>
      </Grid>
    </BrowserRouter>
  )
}

export default App
