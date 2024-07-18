import { Container, Grid } from '@mui/material'
import { FrontPage } from './components/FrontPage'
import { NavBar } from './components/NavBar'
import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './components/Login'
import {
  localityPage,
  personPage,
  projectPage,
  referencePage,
  regionPage,
  speciesPage,
  timeBoundPage,
  timeUnitPage,
} from './components/pages'
import { Notification, NotificationContext, Severity } from './components/Notification'

const App = () => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<Severity | undefined>('success')

  const notify = (message: string, newSeverity?: Severity) => {
    setMessage(message)
    setOpen(true)
    setSeverity(newSeverity)
  }

  return (
    <BrowserRouter>
      <Notification open={open} severity={severity} message={message} setOpen={setOpen} />
      <NotificationContext.Provider value={{ notify }}>
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
                <Route element={personPage} path="/person/:id?" />
                <Route element={projectPage} path="/project/:id?" />
                <Route element={<Login />} path="/login" />
                <Route element={<FrontPage />} path="/" />
                <Route element={<div>Page not found.</div>} path="*" />
              </Routes>
            </Grid>
          </Container>
        </Grid>
      </NotificationContext.Provider>
    </BrowserRouter>
  )
}

export default App
