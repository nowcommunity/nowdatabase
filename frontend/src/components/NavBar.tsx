import { AppBar, Box, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearUser } from '../redux/userReducer'
import { api } from '../redux/api'
import { MouseEvent, useState } from 'react'
import { Role } from '@/shared/types'
import { useUser } from '@/hooks/user'
import { ENV } from '@/util/config'
import { useNotify } from '@/hooks/notification'
import PersonIcon from '@mui/icons-material/Person'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import '../styles/NavBar.css'

type LinkDefinition = { title: string; url: string; children?: LinkDefinition[]; allowedRoles?: Role[] }

export const NavBar = () => {
  const user = useUser()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const notify = useNotify()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    // Warning: This code doesnt support many dropdown menus. fix if more should be added
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const linkFontSize = 18
  const pages: LinkDefinition[] = [
    // { title: 'Front Page', url: '/' },
    {
      title: 'Search',
      url: '',
      children: [
        { title: 'Localities', url: '/locality' },
        { title: 'Species', url: '/species' },
        { title: 'Cross-Search', url: '/crosssearch' },
      ],
    },
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
    { title: 'Map', url: '/map' },
  ]

  // if (user.username) pages.push({ title: 'User', url: '/person/user-page' })

  const logout = () => {
    dispatch(clearUser())
    // Reset api, so that we won't show cached private data to guest user
    dispatch(api.util.resetApiState())
    localStorage.clear()
    notify('Logged out!')
    navigate('/')
  }

  const logoutButton = (
    <MenuItem onClick={logout} style={{ display: 'inline-block' }} className="logout-link">
      <Typography textAlign="center">Logout</Typography>
    </MenuItem>
  )

  const renderLink = (link: LinkDefinition) => {
    if (ENV !== 'dev' && link.title == 'Map') return null
    if (link.children) {
      return (
        <MenuItem key={`${link.url}-menuitem`} style={{ display: 'inline-block', padding: 0 }} className="menu-item">
          <Box
            id={`${link.url}-menu-button`}
            aria-controls={open ? `${link.url}-menuitem` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ color: 'white', paddingTop: '6px', paddingBottom: '6px', paddingLeft: '16px', paddingRight: '16px' }}
            className="dropdown-link"
          >
            <Typography textAlign="center" fontSize={linkFontSize}>
              {link.title}
            </Typography>
            <ArrowDropDownIcon />
          </Box>
          <Menu
            id={`${link.url}-menu`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': `${link.url}-menu-button`,
            }}
          >
            {link.children
              .filter(childLink => !childLink.allowedRoles || childLink.allowedRoles.includes(user.role))
              .map(childLink => (
                <MenuItem
                  key={`${childLink.url}-menu-link`}
                  id={`${childLink.url}-menu-link`}
                  component={Link}
                  to={childLink.url}
                  onClick={handleClose}
                >
                  {childLink.title}
                </MenuItem>
              ))}
          </Menu>
        </MenuItem>
      )
    }
    return (
      <MenuItem
        key={`${link.url}-menuitem`}
        component={Link}
        to={link.url}
        style={{ display: 'inline-block' }}
        className="menu-item"
      >
        <Typography textAlign="center" fontSize={linkFontSize}>
          {link.title}
        </Typography>
      </MenuItem>
    )
  }

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
        <MenuList className="menu-list" style={{ alignContent: 'center' }}>
          {pages
            .filter(childLink => !childLink.allowedRoles || childLink.allowedRoles.includes(user.role))
            .map(page => renderLink(page))}
        </MenuList>
        <Box alignContent="center" className="user-controls">
          {user.username ? (
            <Stack className="logged-in-controls">
              <a className="username-box" href="/person/user-page">
                <PersonIcon />
                <span>{user.username}</span>
              </a>
              {logoutButton}
            </Stack>
          ) : (
            <Stack alignContent="center" className="login-link">
              {renderLink({ title: 'Login', url: 'login' })}
            </Stack>
          )}
        </Box>
      </Stack>
    </AppBar>
  )
}
