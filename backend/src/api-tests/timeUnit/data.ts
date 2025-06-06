import { EditDataType, EditMetaData, TimeUnitDetailsType } from '../../../../frontend/src/shared/types'

const references = [
  {
    rid: 10039,
    ref_journal: {
      journal_title: 'Geology',
    },
    ref_authors: [
      {
        au_num: 1,
        author_surname: 'Cande',
        author_initials: 'S.C.',
      },
    ],
    title_primary: 'A new geomagnetic polarity time scale for the Late Cretaceous and Cenozoic',
    date_primary: 1992,
    title_secondary: undefined,
  },
  {
    rid: 21368,
    ref_journal: {
      journal_title: 'Geology',
    },
    ref_authors: [
      {
        au_num: 1,
        author_surname: 'Ciochon',
        author_initials: 'Russell.',
      },
    ],
    title_primary: 'Dated co-occurrence of Homo erectus and Gigantopithecus from Tham Khuyen Cave, Vietnam',
    date_primary: 1996,
    title_secondary: undefined,
  },
]

export const newTimeUnitBasis: EditDataType<TimeUnitDetailsType & EditMetaData> = {
  tu_display_name: 'Bahean Test',
  up_bnd: 20214,
  low_bnd: 20213,
  rank: 'Age',
  sequence: 'chlma',
  tu_comment: 'test comment',
  now_tau: [],
  comment: 'test create time unit',
  references: references,
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
  references: references,
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
  references: references,
}
