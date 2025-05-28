import { AppBar, Box, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearUser } from '../redux/userReducer'
import { api } from '../redux/api'
import { Role } from '@/shared/types'
import { useUser } from '@/hooks/user'
import { ENV } from '@/util/config'
import { useNotify } from '@/hooks/notification'
import PersonIcon from '@mui/icons-material/Person'
import '../styles/NavBar.css'
import { LinkDefinition, NavBarLink } from './NavBarLink'

export const NavBar = () => {
  const user = useUser()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const notify = useNotify()
  const pages: LinkDefinition[] = [
    { title: 'Localities', url: '/locality' },
    { title: 'Species', url: '/species' },
    { title: 'Cross-Search', url: '/crosssearch' },
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

  const getModeText = () => {
    if (ENV === 'staging') return '(test)'
    if (ENV === 'dev') return '(dev)'
    return ''
  }
  return (
    <AppBar position="static" id="main-navbar">
      <Stack spacing={10} direction="row" marginLeft={2} justifyContent="flex-start">
        <MenuItem component={Link} to="/">
          <Typography fontSize={'1.4em'}>NOW Database {getModeText()}</Typography>
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
      </Stack>
    </AppBar>
  )
}
