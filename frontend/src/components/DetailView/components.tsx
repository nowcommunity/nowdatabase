import { useNavigate } from 'react-router-dom'
import { Button, Box, Typography, CircularProgress, Divider, alpha, List, ListItemText } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { usePageContext } from '../Page'
import { useDetailContext } from './Context/DetailContext'
import { EditDataType } from '@/backendTypes'
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
        const errorObject = validator(editData, field)
        if (errorObject.error) {
          if (!(fieldAsString in fieldsWithErrors)) {
            setFieldsWithErrors(prevFieldsWithErrors => {
              return { ...prevFieldsWithErrors, [fieldAsString]: errorObject }
            })
          }
        } else if (!errorObject.error && fieldAsString in fieldsWithErrors) {
          setFieldsWithErrors(prevFieldsWithErrors => {
            const newFieldsWithErrors = { ...prevFieldsWithErrors }
            delete newFieldsWithErrors[fieldAsString]
            return newFieldsWithErrors
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  return (
    <Button
      disabled={Object.keys(fieldsWithErrors).length > 0}
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

export const ErrorBox = <T,>() => {
  const { fieldsWithErrors } = useDetailContext<T>()
  const fields = Object.keys(fieldsWithErrors)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 1,
        padding: '0.7em',
        boxShadow: 2,
        bgcolor: alpha('#ff0000', 0.5),
      }}
    >
      <Typography color="text.secondary" gutterBottom>
        {`${fields.length} Invalid fields`}
      </Typography>
      <List sx={{ maxHeight: '5em', maxWidth: '30em', padding: '0em 0.8em 0em 0.8em', overflow: 'auto' }}>
        {fields.map(field => (
          <>
            <ListItemText
              sx={{ color: 'text.secondary' }}
              primary={`${fieldsWithErrors[field].name}: ${fieldsWithErrors[field].error}`}
            />
            <Divider />
          </>
        ))}
      </List>
    </Box>
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
