import { Autocomplete, TextField } from '@mui/material'
import { useEffect } from 'react'

import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { checkFieldErrors } from '@/components/DetailView/common/checkFieldErrors'
import { DataValue } from '@/components/DetailView/common/tabLayoutHelpers'
import type { EditDataType, SpeciesDetailsType } from '@/shared/types'
import type { TaxonomySuggestionField as TaxonomySuggestionFieldName } from './taxonomySuggestions'

const FIELD_WIDTH = '14em'

type TaxonomySuggestionFieldProps = {
  field: TaxonomySuggestionFieldName
  options: string[]
}

export const TaxonomySuggestionField = ({ field, options }: TaxonomySuggestionFieldProps) => {
  const { editData, setEditData, validator, fieldsWithErrors, setFieldsWithErrors } =
    useDetailContext<SpeciesDetailsType>()
  const errorObject = validator(editData, field)
  const { error } = errorObject

  const updateField = (value: string) => {
    const nextEditData: EditDataType<SpeciesDetailsType> = { ...editData, [field]: value }
    setEditData(nextEditData)
    const nextErrorObject = validator(nextEditData, field)
    checkFieldErrors(field, nextErrorObject, fieldsWithErrors, setFieldsWithErrors)
  }

  useEffect(() => {
    checkFieldErrors(field, errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject.error, errorObject.name])

  const editingComponent = (
    <Autocomplete
      freeSolo
      autoHighlight
      id={`${field}-taxonomy-suggestions`}
      options={options}
      value={editData[field] ?? ''}
      inputValue={editData[field] ?? ''}
      onInputChange={(_, value) => updateField(value)}
      onChange={(_, value) => updateField(value ?? '')}
      sx={{ width: FIELD_WIDTH }}
      renderInput={params => (
        <TextField
          {...params}
          id={`${field}-textfield`}
          variant="outlined"
          size="small"
          error={!!error}
          helperText={error ?? ''}
          onBlur={event => updateField(event.currentTarget.value.trim())}
        />
      )}
    />
  )

  return <DataValue<SpeciesDetailsType> field={field} EditElement={editingComponent} />
}
