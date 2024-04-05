/* eslint-disable no-console */
import { Container, Grid } from '@mui/material'
import { FrontPage } from './components/FrontPage'
import { NavBar } from './components/NavBar'

const App = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid item>
          <Container maxWidth="sm" fixed>
            <FrontPage />
          </Container>
        </Grid>
      </Grid>
    </>
  )
}

export default App
