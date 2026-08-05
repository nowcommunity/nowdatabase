import { EditDataType, ProjectDetailsType } from '../types'
import { Validators, validateFields, validator } from './validator'

/*
 pid: number;
 contact: string;
 proj_code: string | null;
 proj_name: string | null;
 proj_status: string | null;
 proj_records: boolean | null;
  */

const projectValidators: Validators<Partial<EditDataType<ProjectDetailsType>>> = {
  contact: {
    name: 'Coordinator',
    required: true,
  },
  proj_code: {
    name: 'Project Code',
    required: true,
    maxLength: 10,
    asString: true,
  },
  proj_name: {
    name: 'Project Name',
    required: true,
  },
  proj_status: {
    name: 'Project Status',
    required: true,
    asString: value => {
      if (!['current', 'no_data', 'finished'].includes(value))
        return 'Project Status must be one of the following: "current", "no_data", or "finished".'
      return null
    },
  },
  proj_records: {
    name: 'Record Status',
    required: true,
  },
  now_proj_people: {
    name: 'Members',
    required: true,
  },
}

export const validateProject = (
  editData: EditDataType<ProjectDetailsType>,
  fieldName: keyof EditDataType<ProjectDetailsType>
) => {
  return validator<EditDataType<ProjectDetailsType>>(projectValidators, editData, fieldName)
}

export const validateProjectFields = (editData: Partial<EditDataType<ProjectDetailsType>>) =>
  validateFields<EditDataType<ProjectDetailsType>>(projectValidators, editData)
