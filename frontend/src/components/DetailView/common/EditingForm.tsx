import { Box, TextField } from '@mui/material'
import { EditingModal } from './FormComponents'
import { useForm } from 'react-hook-form'
import { Editable } from '@/backendTypes'
import { useEffect } from 'react'

export type EditingFormField = { name: string; label: string; required?: boolean }

export const EditingForm = <T extends object>({
  buttonText,
  formFields,
  editAction,
  existingObject,
}: {
  buttonText: string
  formFields: EditingFormField[]
  editAction: (newObject: T) => void
  existingObject?: T | undefined
}) => {
  const getDefaultValues: () => { [x: string]: unknown } = () => {
    if (!existingObject) return {}
    return existingObject
  }
  const { register, trigger, formState, getValues } = useForm({ defaultValues: getDefaultValues() })
  const { errors } = formState

  useEffect(() => {
    if (!existingObject) return
  }, [existingObject])

  const onSave = async () => {
    const result = await trigger()
    if (!result) return false
    const values = getValues()
    const newObject: Editable<T> = { ...(values as T), rowState: 'new' }
    editAction(newObject)
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
