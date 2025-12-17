import { Container, Grid } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { Notification, NotificationContextProvider } from './components/Notification'
import { Footer } from './Footer'

const App = () => {
  return (
    <NotificationContextProvider>
      <Notification />
      <div id="wrapper">
        <Grid container>
          <Grid item xs={12}>
            <NavBar />
          </Grid>
          <Container maxWidth="xl" fixed style={{ marginTop: '2em', marginBottom: '2em' }}>
            <Grid item>
              <Outlet />
            </Grid>
          </Container>
        </Grid>
        <Footer />
      </div>
    </NotificationContextProvider>
  )
}

export default App
