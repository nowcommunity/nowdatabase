import { AppBar, Box, Menu, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { clearUser } from '../redux/userReducer'
import { api } from '../redux/api'
import { MouseEvent, useState } from 'react'

type LinkDefinition = { title: string; url: string; children?: LinkDefinition[] }

export const NavBar = () => {
  const user = useSelector((store: RootState) => store.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    // Warning: This code doesnt support many dropdown menus. fix if more should be added
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const pages: LinkDefinition[] = [
    { title: 'Locality', url: '/locality' },
    { title: 'Species', url: '/species' },
    { title: 'Reference', url: '/reference' },
    { title: 'Time Unit', url: '/time-unit' },
    { title: 'Time Bound', url: '/time-bound' },
    {
      title: 'Admin',
      url: '/admin',
      children: [
        { title: 'Region', url: '/region' },
        { title: 'Project', url: '/project' },
      ],
    },
  ]

  const logout = () => {
    dispatch(clearUser())
    // Reset api, so that we won't show cached private data to guest user
    dispatch(api.util.resetApiState())
    localStorage.clear()
    navigate('/')
  }

  const logoutButton = (
    <MenuItem onClick={logout} style={{ display: 'inline-block' }}>
      <Typography component="h4" textAlign="center">
        Logout
      </Typography>
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
            <Typography component="h4" textAlign="center">
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
            {link.children.map(childLink => (
              <MenuItem key={`${childLink.url}-menu-link`} component={Link} to={childLink.url} onClick={handleClose}>
                {childLink.title}
              </MenuItem>
            ))}
          </Menu>
        </MenuItem>
      )
    }
    return (
      <MenuItem key={`${link.url}-menuitem`} component={Link} to={link.url} style={{ display: 'inline-block' }}>
        <Typography component="h4" textAlign="center">
          {link.title}
        </Typography>
      </MenuItem>
    )
  }

  return (
    <AppBar position="static">
      <Stack spacing={10} direction="row" marginLeft={2} justifyContent="space-between">
        <MenuItem component={Link} to="/">
          <Typography component="h1" fontSize={'2.2em'}>
            Now Database
          </Typography>
        </MenuItem>
        <MenuList style={{ alignContent: 'center' }}>{pages.map(page => renderLink(page))}</MenuList>
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
