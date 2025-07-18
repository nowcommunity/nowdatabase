import { Container, Grid } from '@mui/material'
import { NavBar } from './components/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './components/Login'
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
} from './components/pages'
import { Notification, NotificationContextProvider } from './components/Notification'
import { EmailPage } from './components/EmailPage'
import { Footer } from './Footer'

const App = () => {
  return (
    <BrowserRouter>
      <NotificationContextProvider>
        <Notification />
        <div id="wrapper">
          <Grid container>
            <Grid item xs={12}>
              <NavBar />
            </Grid>
            <Container maxWidth="xl" fixed style={{ marginTop: '2em', marginBottom: '2em' }}>
              <Grid item>
                <Routes>
                  <Route element={crossSearchPage} path="/crosssearch/:id?" />
                  <Route element={localityPage} path="/locality/:id?" />
                  <Route element={speciesPage} path="/species/:id?" />
                  <Route element={museumPage} path="/museum/:id?" />
                  <Route element={referencePage} path="/reference/:id?" />
                  <Route element={timeUnitPage} path="/time-unit/:id?" />
                  <Route element={timeBoundPage} path="/time-bound/:id?" />
                  <Route element={regionPage} path="/region/:id?" />
                  <Route element={personPage} path="/person/:id?" />
                  <Route element={projectPage} path="/project/:id?" />
                  <Route element={<EmailPage />} path="/email/" />
                  <Route element={<Login />} path="/login" />
                  <Route element={frontPage} path="/" />
                  <Route element={<div>Page not found.</div>} path="*" />
                </Routes>
              </Grid>
            </Container>
          </Grid>
          <Footer />
        </div>
      </NotificationContextProvider>
    </BrowserRouter>
  )
}

export default App
