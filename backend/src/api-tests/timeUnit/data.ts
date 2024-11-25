import { EditDataType, EditMetaData, Reference, TimeUnitDetailsType } from '../../../../frontend/src/shared/types'

export const newTimeUnitBasis: EditDataType<TimeUnitDetailsType & EditMetaData> = {
  tu_display_name: 'Bahean Test',
  up_bnd: 20214,
  low_bnd: 20213,
  rank: 'Age',
  sequence: 'chlma',
  tu_comment: 'test comment',
  now_tau: [],
  comment: 'test create time unit',
  references: [{ rid: 24188 } as Reference],
}

export const editedTimeUnit: EditDataType<TimeUnitDetailsType & EditMetaData> = {
  tu_name: 'baheantest',
  tu_display_name: 'Bahean Test',
  up_bnd: 20214,
  low_bnd: 20213,
  rank: 'Age',
  sequence: 'gcss',
  tu_comment: 'test comment edited',
  now_tau: [],
  comment: 'test updating time unit',
  references: [{ rid: 24188 } as Reference],
}

export const conflictingTimeUnit: EditDataType<TimeUnitDetailsType & EditMetaData> = {
  tu_name: 'olduvai',
  tu_display_name: 'Olduvai',
  up_bnd: 11,
  low_bnd: 14,
  rank: 'Subchron',
  sequence: 'magneticpolarityts',
  tu_comment: 'C2n',
  now_tau: [],
  comment: 'test updating time unit',
  references: [{ rid: 24188 } as Reference],
}
