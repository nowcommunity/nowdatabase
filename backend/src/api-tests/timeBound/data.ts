import { EditDataType, EditMetaData, TimeBoundDetailsType } from '../../../../frontend/src/backendTypes'

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

export const newTimeBoundBasis: EditDataType<TimeBoundDetailsType & EditMetaData> = {
  b_name: 'C2N-y',
  age: 1.778,
  b_comment: null,
  references: references,
  comment: 'test time bound',
  now_bau: [],
}

export const editedTimeBound: EditDataType<TimeBoundDetailsType & EditMetaData> = {
  bid: 11,
  b_name: 'C6N-y',
  age: 1.778,
  b_comment: 'test comment',
  comment: 'test updating time unit',
  references: references,
  now_bau: [],
}
