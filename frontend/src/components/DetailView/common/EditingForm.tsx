import { Box, TextField } from '@mui/material'
import { EditingModal } from './EditingModal'
import { useForm } from 'react-hook-form'
import { Editable } from '@/backendTypes'
import { useDetailContext } from '../hooks'

export type EditingFormField = { name: string; label: string; required?: boolean }

/* 
Renders a button, that will open EditingModal, which can be used
to add a new entry to a list, or edit existing one.
If using for adding new, provide arrayFieldName.
For editing existing row, use existingObject and editAction.
*/
export const EditingForm = <T extends object, PT extends object>({
  buttonText,
  formFields,
  editAction,
  existingObject,
  arrayFieldName,
}: {
  buttonText: string
  formFields: EditingFormField[]
  arrayFieldName?: keyof PT
  editAction?: (newObject: T) => void
  existingObject?: T | undefined
}) => {
  const getDefaultValues: () => { [x: string]: unknown } = () => {
    if (!existingObject) return {}
    return existingObject
  }
  const { register, trigger, formState, getValues } = useForm({ defaultValues: getDefaultValues() })
  const { errors } = formState
  const { editData, setEditData } = useDetailContext<PT>()

  const onSave = async () => {
    const result = await trigger()
    if (!result) return false
    const values = getValues()
    const newObject: Editable<T> = { ...(values as T), rowState: 'new' }
    if (arrayFieldName) setEditData({ ...editData, museums: [...(editData[arrayFieldName] as Array<T>), newObject] })
    if (editAction) editAction(newObject)
    return true
  }

  return (
    <EditingModal {...{ buttonText, onSave }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        {formFields.map(field => (
          <TextField
            key={field.name}
            {...register(field.name, { required: field.required })}
            error={!!errors[field.name]}
            {...{ label: field.label, required: field.required }}
          />
        ))}
      </Box>
    </EditingModal>
  )
}
