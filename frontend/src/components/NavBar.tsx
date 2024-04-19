import { AppBar, Box, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { clearUser } from '../redux/userReducer'
import { api } from '../redux/api'

export const NavBar = () => {
  const user = useSelector((store: RootState) => store.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const pages = [
    { title: 'Front page', url: '/' },
    { title: 'Locality', url: '/locality' },
    { title: 'Species', url: '/species' },
    { title: 'Time unit', url: '/time-unit' },
  ]

  if (user.username === null) pages.push({ title: 'Login', url: '/login' })

  const logout = () => {
    dispatch(clearUser())
    // Reset api, so that we won't show cached private data to guest user
    dispatch(api.util.resetApiState())
    localStorage.clear()
    navigate('/')
  }

  return (
    <AppBar position="static">
      <Stack spacing={10} direction="row" marginLeft={2} justifyContent="space-between">
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
          {user.username && (
            <MenuItem onClick={logout} style={{ display: 'inline-block' }}>
              <Typography component="h4" textAlign="center">
                Logout
              </Typography>
            </MenuItem>
          )}
        </MenuList>
        <Box alignContent="center" style={{ marginTop: 'auto', marginBottom: 'auto' }} paddingRight="1em">
          {user.username ? `Logged in as ${user.username}` : 'Not logged in'}
        </Box>
      </Stack>
    </AppBar>
  )
}
