import { AppBar, Box, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearUser } from '../redux/userReducer'
import { api } from '../redux/api'
import { Role } from '@/shared/types'
import { useUser } from '@/hooks/user'
import { useNotify } from '@/hooks/notification'
import PersonIcon from '@mui/icons-material/Person'
import '../styles/NavBar.css'
import { LinkDefinition, NavBarLink } from './NavBarLink'

import logo from '../resource/nowlogo.jpg'

export const NavBar = () => {
  const user = useUser()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const notify = useNotify()
  const pages: LinkDefinition[] = [
    { title: 'Localities', url: '/locality' },
    { title: 'Species', url: '/species' },
    { title: 'Locality-Species', url: '/crosssearch' },
    { title: 'References', url: '/reference' },
    { title: 'Time Units', url: '/time-unit' },
    { title: 'Time Bounds', url: '/time-bound', allowedRoles: [Role.Admin, Role.EditUnrestricted] },
    {
      title: 'Admin',
      url: '/admin',
      allowedRoles: [Role.Admin],
      children: [
        { title: 'Regions', url: '/region' },
        { title: 'Projects', url: '/project' },
        { title: 'People', url: '/person' },
        { title: 'Email', url: '/email' },
      ],
    },
  ]

  const logout = () => {
    dispatch(clearUser())
    // Reset api, so that we won't show cached private data to guest user
    dispatch(api.util.resetApiState())
    localStorage.clear()
    notify('Logged out!')
    navigate('/')
  }

  const logoutButton = (
    <MenuItem onClick={logout} className="logout-link menu-item">
      <Typography textAlign="center" fontSize={18}>
        Logout
      </Typography>
    </MenuItem>
  )

  return (
    <AppBar position="static" id="main-navbar">
      <div className="container">
        <MenuItem component={Link} to="/" className="logo-link">
          <img src={logo} title="Logo © Noira Martiskainen" />
        </MenuItem>
        <MenuList className="menu-list">
          {pages
            .filter(childLink => !childLink.allowedRoles || childLink.allowedRoles.includes(user.role))
            .map(page => (
              <NavBarLink key={page.url} link={page} />
            ))}
        </MenuList>
        <Box className="user-controls">
          {user.username ? (
            <Stack className="logged-in-controls">
              <Link className="username-box" to="/person/user-page">
                <PersonIcon />
                <span>{user.username}</span>
              </Link>
              {logoutButton}
            </Stack>
          ) : (
            <Stack>
              <NavBarLink link={{ title: 'Login', url: 'login' }} />
            </Stack>
          )}
        </Box>
      </div>
    </AppBar>
  )
}
