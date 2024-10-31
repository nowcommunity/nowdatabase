import { useNavigate } from 'react-router-dom'
import { Button, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { usePageContext } from '../Page'
import { useDetailContext } from './Context/DetailContext'
import { EditDataType } from '@/backendTypes'
import { useState } from 'react'

export const WriteButton = <T,>({
  onWrite,
  hasStagingMode = false,
}: {
  onWrite: (editData: EditDataType<T>, setEditData: (editData: EditDataType<T>) => void) => Promise<void>
  hasStagingMode?: boolean
}) => {
  const { editData, setEditData, mode, setMode, allErrors } = useDetailContext<T>()
  const [loading, setLoading] = useState(false)

  const getButtonText = () => {
    if (!mode.staging) return hasStagingMode ? 'Finalize entry' : 'Save changes'
    return 'Complete and save'
  }

  return (
    <Button
      disabled={allErrors.length > 0}
      id="write-button"
      sx={{ width: '20em' }}
      onClick={() => {
        if (!mode.staging && hasStagingMode) {
          setMode(mode.new ? 'staging-new' : 'staging-edit')
          return
        }
        setLoading(true)
        void onWrite(editData, setEditData).then(() => {
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
