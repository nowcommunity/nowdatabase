import { EditDataType, ReferenceDetailsType, ReferenceAuthorType, ReferenceJournalType } from '../backendTypes'
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

export const validateReference = (
  editData: EditDataType<ReferenceDetailsType>,
  fieldName: keyof EditDataType<ReferenceDetailsType>
) => {
  const validators: Validators<Partial<EditDataType<ReferenceDetailsType>>> = {
    title_primary: {
      name: 'title_primary',
      required: true,
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
    },
    ref_journal: {
      name: 'ref_journal',
      required: true,
      miscCheck: journalCheck,
    },
  }

  return validator<EditDataType<ReferenceDetailsType>>(validators, editData, fieldName)
}
