import { Box, MenuItem, TextField } from '@mui/material'
import { EditingModal } from './EditingModal'
import { useForm } from 'react-hook-form'
import { Editable, EditDataType } from '@/shared/types'
import { useDetailContext } from '../Context/DetailContext'
import { useEffect } from 'react'

export type EditingFormSelectOption = { value: string | number; label: string }

export type EditingFormField = {
  name: string
  label: string
  required?: boolean
  type?: 'number' | 'string'
  selectOptions?: EditingFormSelectOption[]
}

/* 
Renders a button, that will open EditingModal, which can be used
to add a new entry to a list, or edit existing one.
If using for adding new, provide arrayFieldName.
For editing existing row, use existingObject and editAction.

If you want to autofill the form's fields once the user e.g. clicks a button, 
pass the updated values into the replacedValues prop. The form will be reset and uses those values.
The copyTaxonomyButton prop is used only in Locality -> Species tab.
*/
export const EditingForm = <T extends object, ParentType extends object>({
  dataCy,
  buttonText,
  formFields,
  editAction,
  existingObject,
  arrayFieldName,
  replacedValues,
  copyTaxonomyButton,
}: {
  dataCy?: string
  buttonText: string
  formFields: EditingFormField[]
  arrayFieldName?: keyof ParentType
  editAction?: (newObject: T) => void
  existingObject?: T | undefined
  replacedValues?: T | undefined
  copyTaxonomyButton?: JSX.Element | undefined
}) => {
  const buildDefaultValues = (values?: T) => {
    const defaults = (values ? { ...values } : {}) as Record<string, unknown>

    for (const field of formFields) {
      if (field.selectOptions && defaults[field.name] === undefined) {
        defaults[field.name] = ''
      }
    }

    return defaults
  }

  const defaultValues = buildDefaultValues(existingObject)
  const { register, trigger, formState, getValues, reset } = useForm({ defaultValues, shouldUnregister: true })
  const { errors } = formState
  const { editData, setEditData } = useDetailContext<ParentType>()

  useEffect(() => {
    if (replacedValues) reset(buildDefaultValues(replacedValues))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replacedValues])

  const onSave = async () => {
    const result = await trigger()
    if (!result) return false
    const values = getValues()
    const newObject: Editable<T> = { ...(values as T), rowState: 'new' }
    if (arrayFieldName)
      setEditData({
        ...editData,
        [arrayFieldName]: [...(editData[arrayFieldName as keyof EditDataType<ParentType>] as Array<T>), newObject],
      })
    if (editAction) editAction(newObject)
    reset(buildDefaultValues(existingObject))
    return true
  }

  return (
    <EditingModal {...{ dataCy, buttonText, onSave }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        {copyTaxonomyButton}
        {formFields.map(field => (
          <TextField
            key={field.name}
            slotProps={{ inputLabel: { shrink: true } }}
            select={!!field.selectOptions}
            defaultValue={defaultValues[field.name] ?? (field.selectOptions ? '' : undefined)}
            {...register(field.name, {
              required: field.required ? 'This field is required' : false,
              ...(field.type === 'number' &&
                !field.selectOptions && {
                  pattern: { value: /^(0|[1-9]\d*)(\.\d+)?$/, message: 'Value must be a valid number' },
                }),
            })}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
            {...{ label: field.label, required: field.required }}
          >
            {field.selectOptions?.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ))}
      </Box>
    </EditingModal>
  )
}
