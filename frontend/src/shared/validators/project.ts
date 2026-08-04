import { EditDataType, Project } from '../types'
import { Validators, validateFields, validator } from './validator'

/*
 pid: number;
 contact: string;
 proj_code: string | null;
 proj_name: string | null;
 proj_status: string | null;
 proj_records: boolean | null;
  */

const projectValidators: Validators<Partial<EditDataType<Project>>> = {
  pid: {
    name: 'Project Id',
    required: true,
  },
  contact: {
    name: 'Coordinator',
    required: true,
  },
  proj_code: {
    name: 'Project Code',
    required: true,
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
    asString: value => {
      if (!['public', 'private'].includes(value)) return 'Record Status must be either true or false.'
      return null
    },
  },
}

export const validateProject = (editData: EditDataType<Project>, fieldName: keyof EditDataType<Project>) => {
  return validator<EditDataType<Project>>(projectValidators, editData, fieldName)
}

export const validateProjectFields = (editData: Partial<EditDataType<Project>>) =>
  validateFields<EditDataType<Project>>(projectValidators, editData)
