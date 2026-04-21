import { Card, Stack } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import type { AnyReference, ReferenceOfUpdate } from '@/shared/types'
import { createReferenceSubtitle } from '@/components/Reference/referenceFormatting'

const getReferenceText = (ref: ReferenceOfUpdate) => {
  // Centralized reference formatting (covers more ref types than 1–3).
  // `ReferenceOfUpdate` is a narrower shape than `ReferenceDetailsType`, but `createReferenceSubtitle`
  // intentionally supports both.
  return createReferenceSubtitle(ref)
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
