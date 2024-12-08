import { EditDataType, ReferenceDetailsType, ReferenceAuthorType, ReferenceJournalType } from '../types/dbTypes'
import { Validators, validator, ValidationError } from './validator'

const authorCheck: (data: ReferenceAuthorType[]) => ValidationError = (data: ReferenceAuthorType[]) => {
  if (data.length === 0) {
    return 'There must be at least one author'
  }

  //Check that there's at least one author that's not going to be deleted
  let nonRemovedAuthor = false
  for (const author of data) {
    if (author.rowState && author.rowState !== 'removed') {
      nonRemovedAuthor = true
      break
    }
    if (!author.rowState) {
      nonRemovedAuthor = true
      break
    }
  }
  if (!nonRemovedAuthor) {
    return 'There must be at least one author'
  }

  const errors: string[] = []
  for (const author of data) {
    if (typeof author.au_num !== 'number' || author.au_num < 0 || author.au_num > data.length) {
      const str = 'Something failed with author numbering'
      if (!errors.includes(str)) {
        errors.push(str)
      }
    }
    if (typeof author.author_initials !== 'string' || author.author_initials.length < 1) {
      const str = 'Author initials must be a non-empty string'
      if (!errors.includes(str)) {
        errors.push(str)
      }
    }
    if (typeof author.author_surname !== 'string' || author.author_surname.length < 1) {
      const str = 'Author surname must be a non-empty string'
      if (!errors.includes(str)) {
        errors.push(str)
      }
    }
    if (typeof author.field_id !== 'number' || author.field_id < 0) {
      const str = 'Something failed with setting author field_id'
      if (!errors.includes(str)) {
        errors.push(str)
      }
    }
  }
  if (errors.length > 0) {
    return ('Authors gave the following errors: ' + errors.join(', ')) as ValidationError
  }
  return null as ValidationError
}

const journalCheck: (journal: ReferenceJournalType) => ValidationError = (journal: ReferenceJournalType) => {
  if (!journal) {
    return 'You must select or create a new journal' as ValidationError
  }
  //Existing journal can't have rowState 'removed' if journal is mandatory
  if (journal.rowState && journal.rowState == 'removed') {
    return 'You must select or create a new journal' as ValidationError
  }
  if (typeof journal.journal_title !== 'string' || journal.journal_title?.length < 1) {
    return 'Journal must have a title' as ValidationError
  }
  return null as ValidationError
}

const dateCheck: (dateString: string) => ValidationError = (dateString: string) => {
  // Regular expression to match yyyy-MM-dd format
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateString)) {
    return 'Date must be in the format yyyy-MM-dd'
  }
  const [year, month, day] = dateString.split('-').map(Number)

  if (month < 1 || month > 12) {
    return 'Month must be between 01 and 12'
  }

  const maxDaysInMonth = new Date(year, month, 0).getDate()
  if (day < 1 || day > maxDaysInMonth) {
    return `Day must be between 01 and ${maxDaysInMonth} for month ${month}`
  }
  return null
}

const orCheck = (
  data: EditDataType<ReferenceDetailsType>,
  fieldName: keyof EditDataType<ReferenceDetailsType>
): ValidationError => {
  let fields: (keyof EditDataType<ReferenceDetailsType>)[] = []

  if (data.ref_type_id && [1, 2].includes(data.ref_type_id)) {
    fields = ['title_primary']
  }
  if (data.ref_type_id && [3, 5, 8, 9, 11, 14].includes(data.ref_type_id)) {
    fields = ['title_primary', 'title_secondary', 'title_series', 'gen_notes']
  }
  if (data.ref_type_id && [4, 7, 12, 13].includes(data.ref_type_id)) {
    fields = ['title_primary', 'gen_notes']
  }
  if (data.ref_type_id && [6].includes(data.ref_type_id)) {
    fields = ['title_primary', 'title_secondary', 'gen_notes']
  }
  if (data.ref_type_id == 10) {
    fields = ['gen_notes']
  }

  if (!fields.includes(fieldName)) return null

  const hasValue = fields.some(field => {
    const value = data[field]
    return value != null && typeof value === 'string' && value.length > 0
  })

  if (!hasValue) {
    return `At least one of the following fields must have text: ${fields.join(', ')}`
  }
  return null
}

export const validateReference = (
  editData: EditDataType<ReferenceDetailsType>,
  fieldName: keyof EditDataType<ReferenceDetailsType>
) => {
  const validators: Validators<Partial<EditDataType<ReferenceDetailsType>>> = {
    title_primary: {
      name: 'title_primary',
      useEditData: true,
      miscCheck: (obj: object) => {
        return orCheck(obj as EditDataType<ReferenceDetailsType>, (fieldName = 'title_primary'))
      },
    },
    title_secondary: {
      name: 'title_secondary',
      useEditData: true,
      miscCheck: (obj: object) => {
        return orCheck(obj as EditDataType<ReferenceDetailsType>, (fieldName = 'title_secondary'))
      },
    },
    title_series: {
      name: 'title_series',
      useEditData: true,
      miscCheck: (obj: object) => {
        return orCheck(obj as EditDataType<ReferenceDetailsType>, (fieldName = 'title_series'))
      },
    },
    gen_notes: {
      name: 'gen_notes',
      useEditData: true,
      miscCheck: (obj: object) => {
        return orCheck(obj as EditDataType<ReferenceDetailsType>, (fieldName = 'gen_notes'))
      },
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
      condition: (data: Partial<EditDataType<ReferenceDetailsType>>) => {
        const ids: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        return data.ref_type_id != null && ids.includes(data.ref_type_id)
      },
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
    ref_authors: {
      name: 'ref_authors',
      required: true,
      minLength: 1,
      miscArray: authorCheck,
      condition: (data: Partial<EditDataType<ReferenceDetailsType>>) => {
        const ids: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        return data.ref_type_id != null && ids.includes(data.ref_type_id)
      },
    },
    ref_journal: {
      name: 'ref_journal',
      miscCheck: journalCheck,
      condition: (data: Partial<EditDataType<ReferenceDetailsType>>) => {
        const ids: number[] = [1, 5, 14]
        return data.ref_type_id != null && ids.includes(data.ref_type_id)
      },
    },
    exact_date: {
      name: 'exact_date',
      required: true,
      asString: dateCheck,
      condition: (data: Partial<EditDataType<ReferenceDetailsType>>) => {
        const ids: number[] = [6, 7, 10, 11, 12, 13, 14]
        return data.ref_type_id != null && ids.includes(data.ref_type_id)
      },
    },
  }

  return validator<EditDataType<ReferenceDetailsType>>(validators, editData, fieldName)
}
