import { AppBar, Box, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearUser } from '../redux/userReducer'
import { api } from '../redux/api'
import { MouseEvent, useState } from 'react'
import { Role } from '@/types'
import { useUser } from '@/hooks/user'
import { ENV } from '@/util/config'
import { useNotify } from '@/hooks/notification'

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
    { title: 'Front Page', url: '/' },
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

  if (user.username) pages.push({ title: 'User', url: '/person/user-page' })

  const logout = () => {
    dispatch(clearUser())
    // Reset api, so that we won't show cached private data to guest user
    dispatch(api.util.resetApiState())
    localStorage.clear()
    notify('Logged out!')
    navigate('/')
  }

  const logoutButton = (
    <MenuItem onClick={logout} style={{ display: 'inline-block' }}>
      <Typography textAlign="center">Logout</Typography>
    </MenuItem>
  )

  const renderLink = (link: LinkDefinition) => {
    if (link.children) {
      return (
        <MenuItem key={`${link.url}-menuitem`} style={{ display: 'inline-block', padding: 0 }}>
          <Box
            id={`${link.url}-menu-button`}
            aria-controls={open ? `${link.url}-menuitem` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ color: 'white', paddingTop: '6px', paddingBottom: '6px', paddingLeft: '16px', paddingRight: '16px' }}
          >
            <Typography textAlign="center" fontSize={linkFontSize}>
              {link.title}
            </Typography>
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
      <MenuItem key={`${link.url}-menuitem`} component={Link} to={link.url} style={{ display: 'inline-block' }}>
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
    <AppBar position="static">
      <Stack spacing={10} direction="row" marginLeft={2} justifyContent="space-between">
        <MenuItem component={Link} to="/">
          <Typography fontSize={'2.2em'}>NOW Database {getModeText()}</Typography>
        </MenuItem>
        <MenuList style={{ alignContent: 'center' }}>
          {pages
            .filter(childLink => !childLink.allowedRoles || childLink.allowedRoles.includes(user.role))
            .map(page => renderLink(page))}
        </MenuList>
        <Box
          alignContent="center"
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
          paddingRight="1em"
          paddingTop="0.5em"
        >
          {user.username ? (
            <Stack>
              <div>
                Logged in as <b>{user.username}</b>
              </div>
              {logoutButton}
            </Stack>
          ) : (
            <Stack>
              <div>Guest user</div>
              {renderLink({ title: 'Login', url: 'login' })}
            </Stack>
          )}
        </Box>
      </Stack>
    </AppBar>
  )
}
