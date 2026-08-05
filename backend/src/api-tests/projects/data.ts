import { EditDataType, EditMetaData, ProjectDetailsType } from '../../../../frontend/src/shared/types'
export const newProjectBasis: EditDataType<ProjectDetailsType> & EditMetaData = {
  proj_name: 'LATER Database',
  proj_code: 'LATER',
  contact: 'AD',
  proj_status: 'current',
  proj_records: true,
  now_proj_people: [],
  references: [],
  comment: '',
}

export const editedProject: EditDataType<ProjectDetailsType> & EditMetaData = {
  ...newProjectBasis,
  pid: 3,
  proj_name: 'edited project name',
  proj_code: 'LATER2',
}
