/* eslint-disable no-console */
import { Container, Grid } from '@mui/material'
import { FrontPage } from './components/FrontPage'
import { NavBar } from './components/NavBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Localities } from './components/Localities'

const App = () => {
  return (
    <BrowserRouter>
      <>
        <Grid container>
          <Grid item xs={12}>
            <NavBar />
          </Grid>
          <Grid item>
            <Container maxWidth="xl" fixed>
              <Routes>
                <Route element={<Localities />} path="/locality" />
                <Route element={<FrontPage />} path="/" />
                <Route element={<Container style={{ marginTop: '3em' }}>Page not found.</Container>} path="*" />
              </Routes>
            </Container>
          </Grid>
        </Grid>
      </>
    </BrowserRouter>
  )
}

export default App
