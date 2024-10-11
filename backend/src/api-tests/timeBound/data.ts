import { EditDataType, EditMetaData, Reference, TimeBoundDetailsType } from '../../../../frontend/src/backendTypes'

export const newTimeBoundBasis: EditDataType<TimeBoundDetailsType & EditMetaData> = {
  b_name: 'C2N-y',
  age: 1.778,
  b_comment: null,
  references: [{ rid: 24188 } as Reference],
  comment: 'test time bound',
  now_bau: [],
}

export const editedTimeBound: EditDataType<TimeBoundDetailsType & EditMetaData> = {
  bid: 11,
  b_name: 'C6N-y',
  age: 1.778,
  b_comment: 'test comment',
  comment: 'test updating time bound',
  references: [{ rid: 24188 } as Reference],
  now_bau: [],
}
