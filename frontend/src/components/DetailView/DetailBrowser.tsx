import { Box, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useDetailContext } from './Context/DetailContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePageContext } from '../Page'

export const DetailBrowser = <T extends object>() => {
  const { data, mode } = useDetailContext<T>()
  const navigate = useNavigate()
  const location = useLocation()
  const { idList, idFieldName, viewName, createTitle } = usePageContext<T>()
  const idListExists = idList?.length > 0
  const currentIndex = idList.indexOf((data as { [key: string]: string })[idFieldName])
  const nextIndex = currentIndex + 1
  const previousIndex = currentIndex - 1
  const style = {
    width: '18em',
    marginLeft: '1em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    position: 'relative',
    textAlign: 'left',
    fontSize: '2.3em',
    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      width: '20%',
      height: '100%',
      background: 'linear-gradient(to right, transparent, white 50%)',
    },
  }
  const getText = () => {
    if (mode.read) {
      return `${createTitle(data)}`
    } else if (mode.new) {
      return `Creating new ${viewName}`
    }
    return `${createTitle(data)}`
  }
  const search = location.search

  return (
    <Box
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        display: 'flex',
        gap: '1em',
      }}
    >
      <Box sx={style}>{getText()}</Box>
      {idListExists && mode.read && (
        <div>
          {previousIndex >= 0 && (
            <Button onClick={() => navigate(`/${viewName}/${encodeURIComponent(idList[previousIndex])}${search}`)}>
              <ArrowBackIcon />
            </Button>
          )}
          {`${currentIndex + 1} of ${idList.length}`}
          {nextIndex < idList.length && (
            <Button onClick={() => navigate(`/${viewName}/${encodeURIComponent(idList[nextIndex])}${search}`)}>
              <ArrowForwardIcon />
            </Button>
          )}
        </div>
      )}
    </Box>
  )
}
