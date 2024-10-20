import { EditDataType, ReferenceDetailsType } from '../backendTypes'
import { Validators, validator } from './validator'

export const validateReference = (
  editData: EditDataType<ReferenceDetailsType>,
  fieldName: keyof EditDataType<ReferenceDetailsType>
) => {
  const validators: Validators<Partial<EditDataType<ReferenceDetailsType>>> = {
    // const isNew = editData.lid === undefined
    title_primary: {
      name: 'title_primary',
      required: true,
    },
    ref_type_id: {
      name: 'ref_type_id',
      required: true,
      asNumber: true,
    },
    date_primary: {
      name: 'date_primary',
      required: true,
      asNumber: true,
    },
    start_page: {
      name: 'start_page',
      required: false,
      asNumber: true,
    },
    end_page: {
      name: 'end_page',
      required: false,
      asNumber: true,
    },
    date_secondary: {
      name: 'date_secondary',
      required: false,
      asNumber: true,
    },
  }

  return validator<EditDataType<ReferenceDetailsType>>(validators, editData, fieldName)
}
