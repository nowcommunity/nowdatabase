import { PersonDetailsType } from '../../../../frontend/src/shared/types'

export const existingPerson: Omit<PersonDetailsType, 'user' | 'project_relations' | 'coordinator_relations'> = {
  initials: 'AD',
  first_name: 'adf',
  surname: 'ads',
  full_name: 'adf ads',
  format: null,
  email: 'email',
  user_id: 156,
  organization: 'organization',
  country: 'Finland',
  password_set: new Date('2024-05-22T00:00:00.000Z'),
  used_morph: null,
  used_now: null,
  used_gene: null,
  now_user_group: 'eu',
}

export const newProjectBasis = {
  proj_name: 'LATER Database',
  proj_code: 'LATER',
  contact: 'AD',
  proj_status: 'current',
  proj_records: true,
  now_proj_people: [{ pid: 3, initials: 'AD', com_people: existingPerson }],
  references: [],
  comment: '',
}

export const editedProject = {
  ...newProjectBasis,
  pid: 3,
  proj_name: 'edited project name',
  proj_code: 'LATER2',
}

export const newProjectBasisWithoutMemberArray = {
  proj_name: 'LATER Database',
  proj_code: 'LATER',
  contact: 'AD',
  proj_status: 'current',
  proj_records: true,
  references: [],
  comment: '',
}

export const newProjectBasisWithInvalidMembers = {
  proj_name: 'LATER Database',
  proj_code: 'LATER',
  contact: 'AD',
  proj_status: 'current',
  proj_records: true,
  now_proj_people: [{ pid: 3, initials: 'AD' }],
  references: [],
  comment: '',
}

export const newProjectBasisWithoutCoordinator = {
  proj_name: 'LATER Database',
  proj_code: 'LATER',
  proj_status: 'current',
  proj_records: true,
  now_proj_people: [{ pid: 3, initials: 'AD' }],
  references: [],
  comment: '',
}

export const noMemberArrayError = { name: 'Members', error: 'This field is required' }
export const noCoordinatorError = { name: 'Coordinator', error: 'This field is required' }
