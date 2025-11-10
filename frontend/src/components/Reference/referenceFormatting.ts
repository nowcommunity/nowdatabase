import type { ReferenceDetailsType } from '@/shared/types'

const makeNameList = (names: Array<string | null | undefined>) => {
  if (names.length === 3) {
    return `${names[0]}, ${names[1]} & ${names[2]}`
  } else if (names.length >= 4) {
    return `${names[0]} et al.`
  } else if (names.length === 2) {
    return `${names[0]} & ${names[1]}`
  }
  return names[0] ?? ''
}

const getSurnamesByFieldId = (ref: ReferenceDetailsType, fieldId: number) =>
  ref.ref_authors
    .filter(author => author.field_id === fieldId)
    .map(author => author.author_surname)
    .filter((surname): surname is string => Boolean(surname?.trim()))

export const createReferenceTitle = (ref: ReferenceDetailsType): string => {
  const authorsSurnames = getSurnamesByFieldId(ref, 2)
  const editorsSurnames = getSurnamesByFieldId(ref, 12)

  const hasAuthors = authorsSurnames.length > 0
  const hasEditors = !hasAuthors && editorsSurnames.length > 0

  const authorOrEditorSegment = hasAuthors
    ? makeNameList(authorsSurnames)
    : hasEditors
      ? makeNameList(editorsSurnames)
      : undefined

  const editorLabel = editorsSurnames.length > 1 ? 'eds.' : 'ed.'
  const yearSegment = ref.date_primary != null ? `${ref.date_primary}` : undefined

  let heading: string | undefined
  if (authorOrEditorSegment) {
    if (hasEditors) {
      if (yearSegment) {
        heading = `${authorOrEditorSegment} (${editorLabel}, ${yearSegment})`
      } else {
        heading = `${authorOrEditorSegment} (${editorLabel})`
      }
    } else {
      heading = yearSegment ? `${authorOrEditorSegment} (${yearSegment})` : authorOrEditorSegment
    }
  } else if (yearSegment) {
    heading = yearSegment
  }

  const titleCandidate = [ref.title_primary, ref.title_secondary, ref.title_series, ref.gen_notes]
    .map(value => value?.trim())
    .find(value => value && value.length > 0)

  const segments = [heading, titleCandidate].filter((segment): segment is string => Boolean(segment))

  if (segments.length === 0) {
    return `Reference ${ref.rid}`
  }

  if (!hasAuthors && !hasEditors && titleCandidate) {
    return `${segments.join(' – ')} (Reference ${ref.rid})`
  }

  const result = segments.join(' – ')
  return result.length > 0 ? result : `Reference ${ref.rid}`
}

export const createReferenceSubtitle = (ref: ReferenceDetailsType) => {
  const authorsSurnames = getSurnamesByFieldId(ref, 2)
  const editorsSurnames = getSurnamesByFieldId(ref, 12)
  const authorsPart = `${makeNameList(authorsSurnames)}`
  const editorsPart = `${makeNameList(editorsSurnames)} ${editorsSurnames.length > 1 ? '(eds)' : '(ed)'}`

  let title = `${authorsPart} (${ref.date_primary}).`

  switch (ref.ref_type_id) {
    case 1: {
      title += ` ${ref.title_primary}. ${ref.ref_journal.journal_title}`
      if (ref.volume) {
        title += ` ${ref.volume}`
      }
      if (ref.issue) {
        title += ` (${ref.issue})`
      }
      if (ref.start_page || ref.end_page) {
        title += `: `
      }
      if (ref.start_page) {
        title += `${ref.start_page}-`
      }
      if (ref.end_page) {
        title += `${ref.end_page}`
      }
      if (ref.volume || ref.issue || ref.start_page || ref.end_page) {
        title += `.`
      }
      return title
    }
    case 2: {
      title += ` ${ref.title_primary}.`
      if (ref.publisher || ref.pub_place) {
        title += ` `
      }
      if (ref.publisher) {
        title += `${ref.publisher}`
      }
      if (ref.publisher && ref.pub_place) {
        title += `, `
      }
      if (ref.pub_place) {
        title += `${ref.pub_place}`
      }
      if (ref.publisher || ref.pub_place) {
        title += `.`
      }
      return title
    }
    case 3: {
      title += ` ${ref.title_primary}. IN: ${editorsPart} ${ref.title_secondary}.`

      if (ref.start_page || ref.end_page) {
        title += ` pp.`
      }
      if (ref.start_page) {
        title += `${ref.start_page}`
      }
      if (ref.start_page && ref.end_page) {
        title += `-`
      }
      if (ref.end_page) {
        title += `${ref.end_page}`
      }
      if (ref.start_page || ref.end_page) {
        title += `.`
      }
      if (ref.publisher || ref.pub_place) {
        title += ` `
      }
      if (ref.publisher) {
        title += `${ref.publisher}`
      }
      if (ref.publisher && ref.pub_place) {
        title += `, `
      }
      if (ref.pub_place) {
        title += `${ref.pub_place}`
      }
      if (ref.publisher || ref.pub_place) {
        title += `.`
      }
      return title
    }
    default: {
      if (ref.title_primary) {
        title += ` ${ref.title_primary}.`
      }
      if (ref.title_secondary) {
        title += ` ${ref.title_secondary}.`
      }
      if (ref.title_series) {
        title += ` ${ref.title_series}.`
      }
      if (ref.gen_notes) {
        title += ` ${ref.gen_notes}.`
      }
      return title
    }
  }
}
