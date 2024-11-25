import { useNavigate } from 'react-router-dom'
import { Button, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { usePageContext } from '../Page'
import { useDetailContext } from './Context/DetailContext'
import { EditDataType } from '@/shared/types'
import { useState, useEffect } from 'react'

export const WriteButton = <T,>({
  onWrite,
  hasStagingMode = false,
}: {
  onWrite: (editData: EditDataType<T>, setEditData: (editData: EditDataType<T>) => void) => Promise<void>
  hasStagingMode?: boolean
}) => {
  const { editData, setEditData, mode, setMode, validator, fieldsWithErrors, setFieldsWithErrors } =
    useDetailContext<T>()
  const [loading, setLoading] = useState(false)

  const getButtonText = () => {
    if (!mode.staging) return hasStagingMode ? 'Finalize entry' : 'Save changes'
    return 'Complete and save'
  }

  /*  validates all fields when entering new/editing mode
      to disable write button when unvisited tabs have
      validation errors (e.g. missing required fields) */

  useEffect(() => {
    if (mode.option === 'edit' || mode.option === 'new') {
      for (const field in editData) {
        const fieldAsString = String(field)
        const { error } = validator(editData, field)
        if (error && !fieldsWithErrors.includes(fieldAsString)) {
          setFieldsWithErrors(prevErrors => {
            return [...prevErrors, field]
          })
        } else if (!error && fieldsWithErrors.includes(fieldAsString)) {
          setFieldsWithErrors(prevErrors => {
            return prevErrors.filter(err => err !== fieldAsString)
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  return (
    <Button
      disabled={fieldsWithErrors.length > 0}
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
        id="return-to-editing-button"
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
