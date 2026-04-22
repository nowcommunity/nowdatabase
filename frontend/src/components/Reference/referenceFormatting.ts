import type { ReferenceDetailsType, ReferenceOfUpdate } from '@/shared/types'

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

const getSurnamesByFieldId = (ref: ReferenceDetailsType | ReferenceOfUpdate, fieldId: number) =>
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

const formatExactDate = (exactDate: unknown) => {
  if (!exactDate) return null
  if (exactDate instanceof Date) {
    if (Number.isNaN(exactDate.getTime())) return null
    return exactDate.toISOString().split('T')[0]
  }

  if (typeof exactDate !== 'string' && typeof exactDate !== 'number') {
    return null
  }

  const date = new Date(exactDate)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().split('T')[0]
}

const formatPages = (startPage?: number | null, endPage?: number | null) => {
  if (!startPage && !endPage) return null
  if (startPage && endPage && startPage !== endPage) return `${startPage}-${endPage}`
  return `${startPage ?? endPage}`
}

const formatPublisherPlace = (publisher?: string | null, pubPlace?: string | null) => {
  const parts = [publisher?.trim(), pubPlace?.trim()].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : null
}

const ensurePeriod = (text: string) => (text.trim().endsWith('.') ? text.trim() : `${text.trim()}.`)

const joinSegments = (segments: Array<string | null | undefined>) =>
  segments
    .filter((s): s is string => Boolean(s?.trim()))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

const makeHeading = (ref: ReferenceDetailsType | ReferenceOfUpdate) => {
  const authorsSurnames = getSurnamesByFieldId(ref, 2)
  const editorsSurnames = getSurnamesByFieldId(ref, 12)

  const hasAuthors = authorsSurnames.length > 0
  const hasEditors = !hasAuthors && editorsSurnames.length > 0

  const authorOrEditor = hasAuthors
    ? makeNameList(authorsSurnames)
    : hasEditors
      ? makeNameList(editorsSurnames)
      : undefined

  const year = ref.date_primary != null ? `${ref.date_primary}` : undefined

  if (authorOrEditor && year) return `${authorOrEditor} (${year}).`
  if (authorOrEditor) return `${authorOrEditor}.`
  if (year) return `${year}.`
  return undefined
}

export const createReferenceSubtitle = (ref: ReferenceDetailsType | ReferenceOfUpdate) => {
  const heading = makeHeading(ref)
  const exactDate = formatExactDate(ref.exact_date)
  const pages = formatPages(ref.start_page, ref.end_page)
  const publisherPlace = formatPublisherPlace(ref.publisher, ref.pub_place)

  const authorsSurnames = getSurnamesByFieldId(ref, 2)
  const editorsSurnames = getSurnamesByFieldId(ref, 12)
  const editorsPart = editorsSurnames.length > 0 ? makeNameList(editorsSurnames) : undefined
  const editorsLabel = editorsSurnames.length > 1 ? '(eds)' : '(ed)'

  switch (ref.ref_type_id) {
    case 1: {
      const journalTitle = ref.ref_journal?.journal_title ?? ''
      let title = joinSegments([heading, ref.title_primary ? ensurePeriod(ref.title_primary) : null])
      title = joinSegments([title, journalTitle ? journalTitle : null])
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
      if (publisherPlace) title = joinSegments([title, ensurePeriod(publisherPlace)])
      return title || `Reference ${ref.rid}`
    }
    case 2: {
      const pagesCount = ref.end_page ? `${ref.end_page} pp.` : null
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(ref.title_primary) : null,
          ref.volume ? ensurePeriod(`Ed. ${ref.volume}`) : null,
          ref.issue ? ensurePeriod(`Vol. ${ref.issue}`) : null,
          pagesCount ? ensurePeriod(pagesCount) : null,
          publisherPlace ? ensurePeriod(publisherPlace) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 3: {
      const inSegment = joinSegments([
        'IN:',
        editorsPart ? `${editorsPart} ${editorsLabel}` : null,
        ref.title_secondary ? ensurePeriod(ref.title_secondary) : null,
      ])
      const pagesSegment = pages ? ensurePeriod(`pp. ${pages}`) : null
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(ref.title_primary) : null,
          inSegment ? ensurePeriod(inSegment.replace(/\.\s*$/, '')) : null,
          pagesSegment,
          publisherPlace ? ensurePeriod(publisherPlace) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 4: {
      // Thesis/Dissertation
      const pagesCount = ref.end_page ? `${ref.end_page} pp.` : null
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(ref.title_primary) : null,
          ref.misc_1 ? ensurePeriod(ref.misc_1) : null,
          ref.publisher ? ensurePeriod(ref.publisher) : null,
          pagesCount ? ensurePeriod(pagesCount) : null,
          ref.web_url ? ensurePeriod(ref.web_url) : null,
          exactDate ? ensurePeriod(`Date: ${exactDate}`) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 5: {
      // Conference Proceeding
      const journalTitle = ref.ref_journal?.journal_title ?? ''
      const conference = joinSegments([
        ref.title_secondary ? `"${ref.title_secondary}"` : null,
        ref.date_secondary != null ? `(${ref.date_secondary})` : null,
      ])
      const journalBits = joinSegments([journalTitle || null, ref.volume || null, ref.issue ? `(${ref.issue})` : null])
      const pagesBits = pages ? `: ${pages}` : null
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(ref.title_primary) : null,
          conference ? ensurePeriod(`Conference: ${conference}`) : null,
          journalBits ? ensurePeriod(joinSegments([journalBits, pagesBits])) : null,
          publisherPlace ? ensurePeriod(publisherPlace) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 6: {
      // Electronic Citation
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(ref.title_primary) : null,
          ref.title_secondary ? ensurePeriod(`Organisation: ${ref.title_secondary}`) : null,
          ref.misc_1 ? ensurePeriod(`Updated ${ref.misc_1}`) : null,
          ref.web_url ? ensurePeriod(ref.web_url) : null,
          exactDate ? ensurePeriod(`Accessed ${exactDate}`) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 7: {
      // Internet Communication
      const toSegment = editorsPart ? ensurePeriod(`To: ${editorsPart}`) : null
      const emails = joinSegments([
        ref.misc_1 ? `From email: ${ref.misc_1}` : null,
        ref.misc_2 ? `To email: ${ref.misc_2}` : null,
      ])
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(`Subject: ${ref.title_primary}`) : null,
          toSegment,
          emails ? ensurePeriod(emails) : null,
          exactDate ? ensurePeriod(`Date: ${exactDate}`) : null,
          ref.gen_notes ? ensurePeriod(ref.gen_notes) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 8: {
      // Report
      const reportNo = ref.volume ? ensurePeriod(`Report No. ${ref.volume}`) : null
      const pagesSegment = pages ? ensurePeriod(`pp. ${pages}`) : null
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(ref.title_primary) : null,
          ref.title_secondary ? ensurePeriod(ref.title_secondary) : null,
          reportNo,
          pagesSegment,
          publisherPlace ? ensurePeriod(publisherPlace) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 9: {
      // Unpublished Work
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(ref.title_primary) : null,
          ref.title_secondary ? ensurePeriod(`Organisation: ${ref.title_secondary}`) : null,
          ref.title_series ? ensurePeriod(ref.title_series) : null,
          ref.gen_notes ? ensurePeriod(ref.gen_notes) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 10: {
      // Personal Communication
      const recipients = editorsPart ? ensurePeriod(`Recipients: ${editorsPart}`) : null
      return (
        joinSegments([
          heading,
          ref.misc_1 ? ensurePeriod(`Type: ${ref.misc_1}`) : null,
          recipients,
          exactDate ? ensurePeriod(`Date: ${exactDate}`) : null,
          ref.gen_notes ? ensurePeriod(ref.gen_notes) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 11: {
      // Manuscript
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(ref.title_primary) : null,
          ref.title_secondary ? ensurePeriod(`Organisation: ${ref.title_secondary}`) : null,
          exactDate ? ensurePeriod(`Date: ${exactDate}`) : null,
          ref.gen_notes ? ensurePeriod(ref.gen_notes) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 12: {
      // Notes
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(`Subject: ${ref.title_primary}`) : null,
          exactDate ? ensurePeriod(`Date: ${exactDate}`) : null,
          ref.gen_notes ? ensurePeriod(ref.gen_notes) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    case 13: {
      // Editing
      return (
        joinSegments([
          heading,
          ref.title_primary ? ensurePeriod(ref.title_primary) : null,
          exactDate ? ensurePeriod(`Date: ${exactDate}`) : null,
          ref.gen_notes ? ensurePeriod(ref.gen_notes) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
    default: {
      const fallbackAuthors = authorsSurnames.length > 0 ? makeNameList(authorsSurnames) : undefined
      const year = ref.date_primary != null ? `${ref.date_primary}` : undefined
      const fallbackHeading =
        fallbackAuthors && year
          ? `${fallbackAuthors} (${year}).`
          : fallbackAuthors
            ? `${fallbackAuthors}.`
            : year
              ? `${year}.`
              : undefined
      return (
        joinSegments([
          fallbackHeading,
          ref.title_primary ? ensurePeriod(ref.title_primary) : null,
          ref.title_secondary ? ensurePeriod(ref.title_secondary) : null,
          ref.title_series ? ensurePeriod(ref.title_series) : null,
          ref.gen_notes ? ensurePeriod(ref.gen_notes) : null,
        ]) || `Reference ${ref.rid}`
      )
    }
  }
}
