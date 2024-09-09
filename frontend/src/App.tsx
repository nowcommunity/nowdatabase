import { Container, Grid } from '@mui/material'
import { FrontPage } from './components/FrontPage'
import { NavBar } from './components/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './components/Login'
import {
  crossSearchPage,
  localityPage,
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
import { ENV } from './util/config'

const App = () => {
  return (
    <BrowserRouter>
      <NotificationContextProvider>
        <Notification />
        <Grid container>
          <Grid item xs={12}>
            <Container maxWidth="xl">
              <NavBar />
            </Container>
          </Grid>
          <Container maxWidth="xl" fixed style={{ marginTop: '2em', marginBottom: '2em' }}>
            <Grid item>
              <Routes>
                {ENV == 'dev' &&
				<Route element={crossSearchPage} path="/crosssearch/:id?" />
				}
                <Route element={localityPage} path="/locality/:id?" />
                <Route element={speciesPage} path="/species/:id?" />
                <Route element={referencePage} path="/reference/:id?" />
                <Route element={timeUnitPage} path="/time-unit/:id?" />
                <Route element={timeBoundPage} path="/time-bound/:id?" />
                <Route element={regionPage} path="/region/:id?" />
                <Route element={personPage} path="/person/:id?" />
                <Route element={projectPage} path="/project/:id?" />
                <Route element={<EmailPage />} path="/email/" />
                <Route element={<Login />} path="/login" />
                <Route element={<FrontPage />} path="/" />
                <Route element={<div>Page not found.</div>} path="*" />
              </Routes>
            </Grid>
          </Container>
        </Grid>
      </NotificationContextProvider>
    </BrowserRouter>
  )
}

export default App
