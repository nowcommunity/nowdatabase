import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { useContext } from 'react'
import { PageContext } from '../Page'
import { useDetailContext } from './Context/DetailContext'

export const WriteButton = <T,>({ onWrite, text }: { onWrite: (editData: T) => void; text?: string }) => {
  const { editData, mode, setMode } = useDetailContext<T>()
  return (
    <Button
      sx={{ width: '20em' }}
      onClick={() => {
        if (!mode.staging) {
          setMode(mode.new ? 'staging-edit' : 'staging-new')
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
  if (mode.staging) {
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
