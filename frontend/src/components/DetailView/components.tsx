/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import { Button, Box, Typography, CircularProgress, Divider, alpha, List, ListItemText, Modal } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { usePageContext } from '../Page'
import { useDetailContext } from './Context/DetailContext'
import { EditDataType, Editable, Reference } from '@/shared/types'
import { useState, useEffect, Fragment } from 'react'
import { referenceValidator } from '@/shared/validators/validator'
import { countryBoundingBoxes } from '@/country_data/countryBoundingBoxes'
import { isPointInBox } from '@/util/isPointInBox'

export const OutOfBoundsWarningModal = ({
  isOpen,
  onAnswer,
}: {
  isOpen: boolean
  onAnswer: (answer: boolean) => void
}) => {
  return (
    <Modal open={isOpen} className={`modal ${isOpen ? 'open' : ''}`} onClick={() => onAnswer(false)}>
      <div className="modal-content">
        <h3>Coordinate warning</h3>
        <p style={{ marginBottom: '2em' }}>
          The coordinate selected is outside of the locality country. Do you still want to proceed?
        </p>
        <Button variant="contained" onClick={() => onAnswer(false)}>
          Cancel
        </Button>
        <Button sx={{ marginLeft: '0.6em' }} variant="contained" onClick={() => onAnswer(true)}>
          Proceed
        </Button>
      </div>
    </Modal>
  )
}

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

  const [outOfBoundsWarningOpen, setOutOfBoundsWarningOpen] = useState(false)

  const getButtonText = () => {
    if (!mode.staging) return hasStagingMode ? 'Finalize entry' : 'Save changes'
    return 'Complete and save'
  }

  // Checks if given coordinate is outside of country bounding box
  const isCoordinateOutOfBounds = (dec_lat: number, dec_long: number, country: string): boolean => {
    if (!(country in countryBoundingBoxes)) return false
    return !isPointInBox(dec_lat, dec_long, countryBoundingBoxes[country])
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
    if (mode.staging == true) {
      const error =
        typeof editData === 'object' && editData !== null && 'references' in editData
          ? referenceValidator(editData.references as Editable<Reference>[])
          : 'References key is undefined in the data'
      if (error && !('mandatoryReference' in fieldsWithErrors)) {
        setFieldsWithErrors(prevFieldsWithErrors => {
          const newFieldsWithErrors = {
            ...prevFieldsWithErrors,
            mandatoryReference: { name: 'references', error: error },
          }
          return newFieldsWithErrors
        })
      } else if (!error && 'mandatoryReference' in fieldsWithErrors) {
        setFieldsWithErrors(prevFieldsWithErrors => {
          const newFieldsWithErrors = { ...prevFieldsWithErrors }
          delete newFieldsWithErrors['mandatoryReference']
          return newFieldsWithErrors
        })
      }
    }
    if (!mode.staging) {
      if ('mandatoryReference' in fieldsWithErrors) {
        setFieldsWithErrors(prevFieldsWithErrors => {
          const newFieldsWithErrors = { ...prevFieldsWithErrors }
          delete newFieldsWithErrors['mandatoryReference']
          return newFieldsWithErrors
        })
      }
    }
    // @ts-expect-error Reason: Typescript doesn't recognise that references do exist. Unable to find a way around it. Fix if extra time
  }, [mode, editData.references])

  const save = () => {
    if (!mode.staging && hasStagingMode) {
      setMode(mode.new ? 'staging-new' : 'staging-edit')
      return
    }

    setLoading(true)
    void onWrite(editData, setEditData).then(() => {
      setLoading(false)
      setMode('read')
    })
  }

  return (
    <>
      <OutOfBoundsWarningModal
        isOpen={outOfBoundsWarningOpen}
        onAnswer={isOkay => {
          setOutOfBoundsWarningOpen(false)
          if (isOkay) save()
        }}
      />
      <Button
        disabled={Object.keys(fieldsWithErrors).length > 0}
        id="write-button"
        sx={{ width: '20em' }}
        onClick={() => {
          // Check for out-of-boundness before saving

          if (
            !('dec_lat' in (editData as object)) ||
            !('dec_long' in (editData as object)) ||
            !('country' in (editData as object))
          ) {
            save()
            return
          }

          const localityObject = editData as unknown as { dec_lat: number; dec_long: number; country: string }
          if (
            !isCoordinateOutOfBounds(localityObject['dec_lat'], localityObject['dec_long'], localityObject['country'])
          ) {
            save()
            return
          }

          setOutOfBoundsWarningOpen(true)
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
    </>
  )
}

export const ErrorBox = <T,>() => {
  const { fieldsWithErrors } = useDetailContext<T>()
  const fields = Object.keys(fieldsWithErrors)

  const title = fields.length > 1 ? `${fields.length} invalid fields` : '1 invalid field'

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
        {title}
      </Typography>
      <List sx={{ maxHeight: '5em', maxWidth: '30em', padding: '0em 0.8em 0em 0.8em', overflow: 'auto' }}>
        {fields.map(field => (
          <Fragment key={field}>
            <Divider component="li" />
            <ListItemText
              sx={{ color: 'text.secondary' }}
              primary={`${fieldsWithErrors[field].name}: ${fieldsWithErrors[field].error}`}
            />
          </Fragment>
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
