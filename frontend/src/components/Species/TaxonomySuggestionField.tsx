import { TextField } from '@mui/material'
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
  const suggestionListId = `${field}-taxonomy-suggestions`

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
    <>
      <TextField
        id={`${field}-textfield`}
        inputProps={{ list: suggestionListId }}
        value={editData[field] ?? ''}
        onChange={event => updateField(event.currentTarget.value)}
        variant="outlined"
        size="small"
        error={!!error}
        helperText={error ?? ''}
        onBlur={event => updateField(event.currentTarget.value.trim())}
        sx={{ width: FIELD_WIDTH }}
      />
      <datalist id={suggestionListId}>
        {options.map(option => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </>
  )

  return <DataValue<SpeciesDetailsType> field={field} EditElement={editingComponent} />
}
