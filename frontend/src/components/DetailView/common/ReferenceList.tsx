import { Card, Stack } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import type { AnyReference, ReferenceOfUpdate } from '@/shared/types'

const makeNameList = (names: Array<string | null>) => {
  if (names.length === 3) {
    return `${names[0]}, ${names[1]} & ${names[2]}`
  } else if (names.length >= 4) {
    return `${names[0]} et al.`
  } else if (names.length === 2) {
    return `${names[0]} & ${names[1]}`
  }
  return names[0] ?? ''
}

const getReferenceText = (ref: ReferenceOfUpdate) => {
  const authors = makeNameList(ref.ref_authors.map(author => author.author_surname))
  const issue = ref.issue ? ` (${ref.issue}) ` : ''
  if (ref.ref_type_id === 1) {
    return `${authors} (${ref.date_primary ?? ''}). ${ref.title_primary ?? ''}. ${ref.ref_journal?.journal_title ?? ''} ${ref.volume ?? ''}${issue}${ref.start_page ?? ref.end_page ? ': ' : ''}${
      ref.start_page ?? ''
    }${ref.start_page && ref.end_page ? '-' : ''}${ref.end_page ?? ''}${ref.start_page || ref.end_page ? '.' : ''}${
      ref.publisher || ref.pub_place ? `${ref.publisher || ''} ${ref.pub_place}.` : ''
    }`
  } else if (ref.ref_type_id === 2) {
    return `${ref.ref_authors[0]?.field_id !== 12 ? authors : ''} (${ref.date_primary ?? ''}). ${ref.title_primary ?? ''}. ${
      ref.publisher || ref.pub_place ? ' ' : ''
    }${ref.publisher ?? ''}${ref.publisher && ref.pub_place ? ', ' : ''}${ref.pub_place ?? ''}${
      ref.publisher || ref.pub_place ? '.' : ''
    }`
  } else if (ref.ref_type_id === 3) {
    return `${authors} ${ref.ref_authors.length > 1 ? '(eds)' : ref.ref_authors.length === 1 ? '(ed)' : ''} ${
      ref.title_primary ?? ''
    }. IN: ${authors} ${ref.title_secondary ?? ''}. ${ref.start_page || ref.end_page ? 'pp.' : ''}${ref.start_page ?? ''}${
      ref.start_page && ref.end_page ? '-' : ''
    }${ref.end_page ?? ''}. ${ref.publisher || ref.pub_place ? ' ' : ''}${ref.publisher ?? ''}${
      ref.publisher && ref.pub_place ? ', ' : ''
    }${ref.publisher || ref.pub_place ? '.' : ''}`
  }
  return `${authors} ${ref.date_primary ? `(${ref.date_primary}). ` : ''} ${ref.title_primary?.concat('. ') ?? ''}${
    ref.title_secondary?.concat('. ') ?? ''
  }${ref.title_series?.concat('. ') ?? ''}${ref.gen_notes?.concat('.') ?? ''}`
}

export const ReferenceList = ({ references, big }: { references: AnyReference[]; big: boolean }) => {
  const location = useLocation()
  const returnTo = `${location.pathname}${location.search}`

  return (
    <Stack>
      {references.map(reference => (
        <Card
          key={reference.rid}
          sx={{ padding: '0.4em', margin: '0.5em', maxWidth: big ? '50em' : '30em', backgroundColor: 'lightblue' }}
        >
          <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{getReferenceText(reference.ref_ref)}</div>
          {big && (
            <div>
              <Link to={`/reference/${reference.rid}`} state={{ returnTo }}>
                View
              </Link>
            </div>
          )}
        </Card>
      ))}
    </Stack>
  )
}
