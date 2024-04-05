import { AppBar, Typography } from '@mui/material'

export const NavBar = () => {
  return (
    <AppBar position="static">
      <div style={{ marginLeft: '1em' }}>
        <Typography component="h1" fontSize={'2.2em'}>
          Now Database
        </Typography>
      </div>
    </AppBar>
  )
}
