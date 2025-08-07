/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom'
import { Button, Box, Typography, CircularProgress, Divider, alpha, List, ListItemText } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import { usePageContext } from '../Page'
import { useDetailContext } from './Context/DetailContext'
import { EditDataType, Editable, Reference, Species } from '@/shared/types'
import { useState, useEffect, Fragment } from 'react'
import { referenceValidator } from '@/shared/validators/validator'
import { checkTaxonomy, convertTaxonomyFields } from '../../util/taxonomyFunctions'
import { useLazyGetAllSpeciesQuery, useLazyGetAllSynonymsQuery } from '@/redux/speciesReducer'
import { useNotify } from '@/hooks/notification'
import { countryBoundingBoxes } from '@/country_data/countryBoundingBoxes'
import { boundingBoxSplit, isPointInBoxes } from '@/util/isPointInBox'
import { OutOfBoundsWarningModal, OutOfBoundsWarningModalState } from './OutOfBoundsWarningModal'

export const WriteButton = <T,>({
  onWrite,
  taxonomy,
  hasStagingMode = false,
}: {
  onWrite: (editData: EditDataType<T>, setEditData: (editData: EditDataType<T>) => void) => Promise<void>
  taxonomy?: boolean
  hasStagingMode?: boolean
}) => {
  const { editData, setEditData, mode, setMode, validator, fieldsWithErrors, setFieldsWithErrors } =
    useDetailContext<T>()
  const [loading, setLoading] = useState(false)
  const { notify } = useNotify()
  const [getSpeciesData] = useLazyGetAllSpeciesQuery()
  const [getSynonyms] = useLazyGetAllSynonymsQuery()

  // For coordinate out of bounds warning
  const [warningModalState, setWarningModalState] = useState<OutOfBoundsWarningModalState>({
    decLong: 0,
    decLat: 0,
    boxes: undefined,
  })
  const [warningModalOpen, setWarningModalOpen] = useState(false)

  const getButtonText = () => {
    if (!mode.staging) return hasStagingMode ? 'Finalize entry' : 'Save changes'
    return 'Complete and save'
  }

  // Checks if given coordinate is outside of country bounding box
  const isCoordinateOutOfBounds = (dec_lat: number, dec_long: number, country: string): boolean => {
    if (!(country in countryBoundingBoxes)) return false
    return !isPointInBoxes(dec_lat, dec_long, boundingBoxSplit(countryBoundingBoxes[country]))
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

  const writeWithTaxonomyCheck = async () => {
    let speciesEditData: EditDataType<Species> | undefined = undefined

    if (!mode.staging) {
      const { data: speciesData } = await getSpeciesData(undefined, true)
      const { data: synonyms } = await getSynonyms(undefined, true)
      if (!speciesData) {
        notify('Could not fetch species to check taxonomy data.', 'error')
        return
      }
      if (!synonyms) {
        notify('Could not fetch synonyms to check taxonomy data.', 'error')
        return
      }
      // converts taxonomy fields to capitalized/lowercased
      speciesEditData = convertTaxonomyFields(editData as EditDataType<Species>)
      const errors = checkTaxonomy(speciesEditData, speciesData, synonyms)
      if (errors.size > 0) {
        const errorMessage = [...errors].reduce((acc, currentError) => acc + `\n${currentError}`)
        notify(errorMessage, 'error', null)
        return
      }
      notify('', undefined, 0)
      setEditData(speciesEditData as EditDataType<T>)

      if (hasStagingMode) {
        setMode(mode.new ? 'staging-new' : 'staging-edit')
        return
      }
    }

    void onWrite((speciesEditData as EditDataType<T>) ?? editData, setEditData).then(() => {
      setMode('read')
      return
    })
  }

  const handleWriteButtonClick = async () => {
    if (taxonomy) {
      setLoading(true)
      await writeWithTaxonomyCheck()
      setLoading(false)
      return
    }

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
        isOpen={warningModalOpen}
        onAnswer={isOkay => {
          setWarningModalOpen(false)
          if (isOkay) void handleWriteButtonClick()
        }}
        state={warningModalState}
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
            void handleWriteButtonClick()
            return
          }

          const localityObject = editData as unknown as { dec_lat: number; dec_long: number; country: string }
          if (!isCoordinateOutOfBounds(localityObject.dec_lat, localityObject.dec_long, localityObject.country)) {
            void handleWriteButtonClick()
            return
          }

          setWarningModalOpen(true)
          setWarningModalState({
            decLat: localityObject.dec_lat,
            decLong: localityObject.dec_long,
            // Guaranteed to exist by the isCoordinateOutOfBounds check above,
            // as it will return false and return on no key found
            boxes: boundingBoxSplit(countryBoundingBoxes[localityObject.country]),
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
