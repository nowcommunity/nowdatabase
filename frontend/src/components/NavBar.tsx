import { AppBar, MenuItem, MenuList, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export const NavBar = () => {
  const pages = [
    { title: 'Front page', url: '/' },
    { title: 'Locality', url: '/locality' },
    { title: 'Species', url: '/species' },
    { title: 'Time unit', url: '/time-unit' },
  ]
  return (
    <AppBar position="static">
      <Stack spacing={10} direction="row" marginLeft={2}>
        <Typography component="h1" fontSize={'2.2em'}>
          Now Database
        </Typography>
        <MenuList style={{ alignContent: 'center' }}>
          {pages.map(page => (
            <MenuItem component={Link} to={page.url} style={{ display: 'inline-block' }}>
              <Typography component="h4" textAlign="center">
                {page.title}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Stack>
    </AppBar>
  )
}
