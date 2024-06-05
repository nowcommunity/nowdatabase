import { Container, Grid } from '@mui/material'
import { FrontPage } from './components/FrontPage'
import { NavBar } from './components/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './components/Login'
import {
  localityPage,
  projectPage,
  referencePage,
  regionPage,
  speciesPage,
  timeBoundPage,
  timeUnitPage,
} from './components/pages'

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
              <Route element={regionPage} path="/region/:id?" />
              <Route element={projectPage} path="/project/:id?" />
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
