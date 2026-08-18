import { EditDataType, ProjectDetailsType } from '../types'
import { ValidationError, Validators, validateFields, validator } from './validator'

/*
 pid: number;
 contact: string;
 proj_code: string | null;
 proj_name: string | null;
 proj_status: string | null;
 proj_records: boolean | null;
  */

const memberArrayCheck = (people: object[]) => {
  const errors = new Set<string>()
  people.forEach(person => {
    if (!('initials' in person) || typeof person.initials !== 'string' || person.initials.length === 0) {
      errors.add('Member initials must be a non-empty string')
    }
    if (
      !('com_people' in person) ||
      person.com_people === null ||
      typeof person.com_people !== 'object' ||
      !('user_id' in person.com_people) ||
      !Number.isInteger(person.com_people.user_id)
    ) {
      errors.add('Member must have a com_people object with valid user ID')
    }
  })
  if (errors.size > 0) {
    return ('Project members gave the following errors: ' + Array.from(errors).join(', ')) as ValidationError
  }
  return null
}

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
    miscArray: memberArrayCheck,
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
