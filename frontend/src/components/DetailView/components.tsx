import { useNavigate } from 'react-router-dom'
import { Button, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { usePageContext } from '../Page'
import { useDetailContext } from './Context/DetailContext'
import { EditDataType } from '@/backendTypes'
import { useState } from 'react'

export const WriteButton = <T,>({ onWrite }: { onWrite: (editData: EditDataType<T>) => Promise<void> }) => {
  const { editData, mode, setMode } = useDetailContext<T>()
  const [loading, setLoading] = useState(false)

  const getButtonText = () => {
    if (!mode.staging) return 'Finalize entry'
    return 'Complete and save'
  }
  return (
    <Button
      sx={{ width: '20em' }}
      onClick={() => {
        if (!mode.staging) {
          setMode(mode.new ? 'staging-new' : 'staging-edit')
          return
        }
        setLoading(true)
        void onWrite(editData).then(() => {
          setLoading(false)
          setMode('read')
        })
      }}
      variant="contained"
    >
      {loading ? (
        <CircularProgress size="1.2em" sx={{ color: 'white', marginRight: '1em' }} />
      ) : (
        <SaveIcon style={{ marginRight: '0.5em' }} />
      )}
      {getButtonText()}
    </Button>
  )
}

export const ReturnButton = () => {
  const navigate = useNavigate()
  const { tableUrl } = usePageContext()
  const { mode, setMode } = useDetailContext()

  if (mode.staging) {
    return (
      <Button
        onClick={() => {
          if (mode.new) setMode('new')
          else setMode('edit')
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
