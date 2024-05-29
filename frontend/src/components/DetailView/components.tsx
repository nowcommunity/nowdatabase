import { useNavigate } from 'react-router-dom'
import { useDetailContext } from './hooks'
import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { useContext } from 'react'
import { PageContext } from '../Page'

export const WriteButton = <T,>({ onWrite, text }: { onWrite: (editData: T) => void; text?: string }) => {
  const { editData, mode, setMode } = useDetailContext<T>()
  return (
    <Button
      sx={{ width: '20em' }}
      onClick={() => {
        if (mode === 'edit') {
          setMode('edit-ref')
          return
        }
        if (mode === 'new') {
          setMode('new-ref')
          return
        }
        onWrite(editData)
        setMode('read')
      }}
      variant="contained"
    >
      <SaveIcon style={{ marginRight: '0.5em' }} />
      {text}
    </Button>
  )
}

export const ReturnButton = () => {
  const navigate = useNavigate()
  const { tableUrl } = useContext(PageContext)
  const { mode, setMode } = useDetailContext()
  if (['new-ref', 'edit-ref'].includes(mode)) {
    return (
      <Button
        onClick={() => {
          setMode('edit')
        }}
      >
        <ArrowBackIcon color="primary" style={{ marginRight: '0.2em' }} />
        Return to editing
      </Button>
    )
  }
  return (
    <Button onClick={() => navigate(tableUrl, { relative: 'path' })}>
      <ArrowBackIcon color="primary" style={{ marginRight: '0.2em' }} />
      Return to table
    </Button>
  )
}
