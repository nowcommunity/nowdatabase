import { Container, Grid } from '@mui/material'
import { FrontPage } from './components/FrontPage'
import { NavBar } from './components/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ReferenceTable } from './components/Reference/ReferenceTable'
import { SpeciesTable } from './components/Species/SpeciesTable'
import { TimeUnitTable } from './components/TimeUnit/TimeUnitTable'
import { Login } from './components/Login'
import { SpeciesDetails } from './components/Species/SpeciesDetails'
import { Page } from './components/Page'
import { LocalityTable } from './components/Locality/LocalityTable'
import { LocalityDetails } from './components/Locality/LocalityDetails'

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
              <Route
                element={
                  <Page
                    tableView={<LocalityTable />}
                    detailView={<LocalityDetails />}
                    viewName="locality"
                    idFieldName="lid"
                  />
                }
                path="/locality/:id?"
              />
              <Route
                element={
                  <Page
                    tableView={<SpeciesTable />}
                    detailView={<SpeciesDetails />}
                    viewName="species"
                    idFieldName="species_id"
                  />
                }
                path="/species/:id?"
              />
              <Route
                element={
                  <Page tableView={<ReferenceTable />} detailView={null} viewName="reference" idFieldName="lid" />
                }
                path="/reference/:id?"
              />
              <Route
                element={<Page tableView={<TimeUnitTable />} detailView={null} viewName="time-unit" idFieldName="" />}
                path="/time-unit/:id?"
              />
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
