import { Container, Grid } from '@mui/material'
import { FrontPage } from './components/FrontPage'
import { NavBar } from './components/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LocalityTable } from './components/Locality/LocalityTable'
import { ProjectTable } from './components/Project/ProjectTable'
import { ProjectDetails } from './components/Project/ProjectDetails'
import { ReferenceTable } from './components/Reference/ReferenceTable'
import { RegionTable } from './components/Region/RegionTable'
import { RegionDetails } from './components/Region/RegionDetails'
import { SpeciesTable } from './components/Species/SpeciesTable'
import { TimeUnitTable } from './components/TimeUnit/TimeUnitTable'
import { Login } from './components/Login'
import { LocalityDetails } from './components/Locality/LocalityDetails'
import { SpeciesDetails } from './components/Species/SpeciesDetails'

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
              <Route element={<LocalityDetails />} path="/locality/:id" />
              <Route element={<LocalityTable />} path="/locality/" />
              <Route element={<ProjectTable />} path="/project/" />
              <Route element={<ProjectDetails />} path="/project/:id" />
              <Route element={<ReferenceTable />} path="/reference/" />
              <Route element={<RegionTable />} path="/region/" />
              <Route element={<RegionDetails />} path="/region/:id" />
              <Route element={<SpeciesDetails />} path="/species/:id" />
              <Route element={<SpeciesTable />} path="/species/" />
              <Route element={<TimeUnitTable />} path="/time-unit/" />
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
