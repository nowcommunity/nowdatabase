import { Box, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useDetailContext } from './Context/DetailContext'
import { useNavigate } from 'react-router-dom'
import { usePageContext } from '../Page'

export const DetailBrowser = <T extends object>() => {
  const { data, mode } = useDetailContext<T>()
  const navigate = useNavigate()
  const { idList, idFieldName, viewName, createTitle } = usePageContext<T>()
  const idListExists = idList?.length > 0
  const currentIndex = idList.indexOf((data as { [key: string]: string })[idFieldName])
  const nextIndex = currentIndex + 1
  const previousIndex = currentIndex - 1

  const getText = () => {
    if (mode.read) {
      return `Viewing ${viewName}: ${createTitle(data)}`
    }
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        display: 'flex',
        fontWeight: 'bold',
        fontSize: '22px',
        gap: '1em',
      }}
    >
      <div>{getText()}</div>
      {idListExists && (
        <div>
          {previousIndex >= 0 && (
            <Button onClick={() => navigate(`/${viewName}/${idList[previousIndex]}`)}>
              <ArrowBackIcon />
            </Button>
          )}
          {`${currentIndex + 1} of ${idList.length}`}
          {nextIndex < idList.length && (
            <Button onClick={() => navigate(`/${viewName}/${idList[nextIndex]}`)}>
              <ArrowForwardIcon />
            </Button>
          )}
        </div>
      )}
    </Box>
  )
}
