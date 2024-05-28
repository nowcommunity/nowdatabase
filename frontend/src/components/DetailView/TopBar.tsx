import { Box, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useDetailContext } from './hooks'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { PageContext } from '../Page'

export const TopBar = <T,>() => {
  const { data } = useDetailContext<T>()
  const navigate = useNavigate()
  const { idList, idFieldName, viewName } = useContext(PageContext)
  const idListExists = idList?.length > 0
  const currentIndex = idList.indexOf((data as { [key: string]: string })[idFieldName as string])
  const nextIndex = currentIndex + 1
  const previousIndex = currentIndex - 1

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
      <div> Viewing details of a {viewName}</div>
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
