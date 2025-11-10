import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ContactForm } from './ContactForm'
import type { ReferenceDetailsType } from '@/shared/types'
import { createReferenceTitle } from '@/components/Reference/referenceFormatting'
import { useDetailContext } from '../Context/DetailContext'
import { usePageContext } from '@/components/Page'

jest.mock('../Context/DetailContext', () => ({
  useDetailContext: jest.fn(),
}))

jest.mock('@/components/Page', () => ({
  usePageContext: jest.fn(),
}))

jest.mock('@/redux/emailReducer', () => ({
  useEmailMutation: () => [jest.fn()],
}))

jest.mock('@/hooks/user', () => ({
  useUser: () => ({ initials: 'ABC' }),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: jest.fn() }),
}))

jest.mock('@/redux/personReducer', () => ({
  useGetPersonDetailsQuery: () => ({ data: { full_name: 'Test User', email: 'test@example.com' }, isLoading: false }),
}))

jest.mock('./ContactModal', () => ({
  ContactModal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

describe('ContactForm detail context integration', () => {
  const mockUseDetailContext = useDetailContext as jest.MockedFunction<typeof useDetailContext<ReferenceDetailsType>>
  const mockUsePageContext = usePageContext as jest.MockedFunction<typeof usePageContext<ReferenceDetailsType>>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('prefills the subject with the page context title formatter output', async () => {
    const reference = {
      rid: 30,
      ref_authors: [
        { field_id: 2, author_surname: 'Smith', author_initials: 'J.' },
        { field_id: 2, author_surname: 'Doe', author_initials: 'A.' },
      ],
      date_primary: 1999,
      title_primary: 'A descriptive reference title',
      title_secondary: null,
      title_series: null,
      gen_notes: null,
    } as unknown as ReferenceDetailsType

    const expectedSubject = createReferenceTitle(reference)
    const createTitle = jest.fn(() => expectedSubject)

    mockUseDetailContext.mockReturnValue({ data: reference } as any)
    mockUsePageContext.mockReturnValue({ createTitle } as any)

    render(<ContactForm<ReferenceDetailsType> buttonText="Contact" />)

    const subjectField = await screen.findByLabelText(/subject/i)

    await waitFor(() => {
      expect((subjectField as HTMLInputElement).value).toBe(expectedSubject)
    })

    expect(createTitle).toHaveBeenCalledWith(reference)
  })

  it('falls back to the formatter result when minimal metadata is provided', async () => {
    const reference = {
      rid: 77,
      ref_authors: [],
      date_primary: null,
      title_primary: null,
      title_secondary: null,
      title_series: null,
      gen_notes: null,
    } as unknown as ReferenceDetailsType

    const expectedSubject = createReferenceTitle(reference)
    const createTitle = jest.fn(() => expectedSubject)

    mockUseDetailContext.mockReturnValue({ data: reference } as any)
    mockUsePageContext.mockReturnValue({ createTitle } as any)

    render(<ContactForm<ReferenceDetailsType> buttonText="Contact" />)

    const subjectField = await screen.findByLabelText(/subject/i)

    await waitFor(() => {
      expect((subjectField as HTMLInputElement).value).toBe(expectedSubject)
    })

    expect(createTitle).toHaveBeenCalledWith(reference)
  })
})
