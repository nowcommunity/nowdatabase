import { AppBar, Box, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

export const NavBar = () => {
  const user = useSelector((store: RootState) => store.user)

  const pages = [
    { title: 'Front page', url: '/' },
    { title: 'Locality', url: '/locality' },
    { title: 'Species', url: '/species' },
    { title: 'Time unit', url: '/time-unit' },
    { title: 'Login', url: '/login' },
  ]
  return (
    <AppBar position="static">
      <Stack spacing={10} direction="row" marginLeft={2}>
        <Typography component="h1" fontSize={'2.2em'}>
          Now Database
        </Typography>
        <MenuList style={{ alignContent: 'center' }}>
          {pages.map(page => (
            <MenuItem component={Link} key={page.url} to={page.url} style={{ display: 'inline-block' }}>
              <Typography component="h4" textAlign="center">
                {page.title}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>
        <Box alignContent="center">{user.token ? `Logged in as ${user.token}` : 'Not logged in'}</Box>
      </Stack>
    </AppBar>
  )
}
