import { describe, expect, it } from '@jest/globals'

import { formatReferenceValidationErrorMessage } from '@/components/Reference/referenceValidationErrors'

describe('formatReferenceValidationErrorMessage', () => {
  it('uses reference display labels for backend validation field names', () => {
    const message = formatReferenceValidationErrorMessage(
      {
        status: '403',
        data: [
          { name: 'title_primary', error: 'This field is required' },
          { name: 'gen_notes', error: 'This field is required' },
        ],
      },
      4,
      {
        4: {
          title_primary: 'Title',
          gen_notes: 'Notes',
        },
      }
    )

    expect(message).toBe('Following validators failed: Title: This field is required, Notes: This field is required')
  })

  it('deduplicates grouped title errors that already contain display labels', () => {
    const groupedError = 'At least one of the following fields is required: Title, Notes'
    const message = formatReferenceValidationErrorMessage(
      {
        status: '403',
        data: [
          { name: 'title_primary', error: groupedError },
          { name: 'gen_notes', error: groupedError },
        ],
      },
      4
    )

    expect(message).toBe(`Following validators failed: ${groupedError}`)
  })

  it('falls back to a generic save error for unexpected responses', () => {
    expect(formatReferenceValidationErrorMessage({ status: 500 }, 4)).toBe('Could not edit item. Error happened.')
  })
})
