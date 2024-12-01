import { Box, Button, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useDetailContext } from './Context/DetailContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePageContext } from '../Page'

export const DetailBrowser = <T extends object>() => {
  const { data, mode } = useDetailContext<T>()
  const navigate = useNavigate()
  const location = useLocation()
  const { idList, idFieldName, viewName, createTitle, createSubtitle } = usePageContext<T>()
  const idListExists = idList?.length > 0
  const currentIndex = idList.indexOf((data as { [key: string]: string })[idFieldName])
  const nextIndex = currentIndex + 1
  const previousIndex = currentIndex - 1
  const style = {
    width: '50em',
    marginLeft: '0em',
    overflow: 'hidden',
    whiteSpace: 'pre',
    textOverflow: 'ellipsis',
    position: 'relative',
    textAlign: 'left',
    fontSize: '2.3em',
  }
  const getTitleText = () => {
    if (mode.read) {
      return `${createTitle(data)}`
    } else if (mode.new) {
      return `Creating new ${viewName}`
    }
    return `${createTitle(data)}`
  }

  const getSubtitleText = () => {
    if (mode.read) {
      return `${createSubtitle(data)}`
    } else if (mode.new) {
      return ''
    }
    return `${createSubtitle(data)}`
  }
  const search = location.search

  return (
    <Box
      sx={{
        alignItems: 'left',
        justifyContent: 'space-between',
        height: '100%',
        display: 'flex',
        gap: '1em',
      }}
    >
      <Stack sx={{ gap: '0.5em', width: '85%' }}>
        <Box sx={style}>{getTitleText()}</Box>
        <Box sx={{ ...style, fontSize: '1.2em' }}>{getSubtitleText()}</Box>
      </Stack>
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
