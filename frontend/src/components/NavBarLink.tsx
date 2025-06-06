import { MouseEvent, useState } from 'react'
import { Role } from '@/shared/types'
import { Box, Menu, MenuItem, Typography } from '@mui/material'

import { Link } from 'react-router-dom'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useUser } from '@/hooks/user'

export type LinkDefinition = { title: string; url: string; children?: LinkDefinition[]; allowedRoles?: Role[] }

interface Props {
  link: LinkDefinition
}

export const NavBarLink = ({ link }: Props) => {
  const user = useUser()
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

  if (link.children) {
    return (
      <MenuItem key={`${link.url}-menuitem`} className="menu-item">
        <Box
          id={`${link.url}-menu-button`}
          aria-controls={open ? `${link.url}-menuitem` : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
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
    <MenuItem key={`${link.url}-menuitem`} component={Link} to={link.url} className="menu-item">
      <Typography textAlign="center" fontSize={linkFontSize}>
        {link.title}
      </Typography>
    </MenuItem>
  )
}
