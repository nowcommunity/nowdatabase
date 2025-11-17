import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { Notification, NotificationContextProvider } from '@/components/Notification'
import { ReferenceDetails } from '@/components/Reference/ReferenceDetails'
import {
  useDeleteReferenceMutation,
  useEditReferenceMutation,
  useGetReferenceDetailsQuery,
} from '@/redux/referenceReducer'
import type { ReferenceDetailsType } from '@/shared/types'

jest.mock('@/components/DetailView/DetailView', () => ({
  DetailView: ({ deleteFunction }: { deleteFunction?: () => Promise<void> }) => (
    <button onClick={() => void deleteFunction?.()}>Delete</button>
  ),
}))

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
}))

jest.mock('@/util/config', () => ({
  BACKEND_URL: '',
  ENABLE_WRITE: true,
  ENV: 'test',
}))

jest.mock('@/redux/referenceReducer', () => ({
  useGetReferenceDetailsQuery: jest.fn(),
  useEditReferenceMutation: jest.fn(),
  useDeleteReferenceMutation: jest.fn(),
}))

jest.mock('@/components/Reference/Tabs/ReferenceTab', () => ({ ReferenceTab: () => <div>Reference Tab</div> }))
jest.mock('@/components/Reference/Tabs/LocalityTab', () => ({ LocalityTab: () => <div>Locality Tab</div> }))
jest.mock('@/components/Reference/Tabs/SpeciesTab', () => ({ SpeciesTab: () => <div>Species Tab</div> }))
jest.mock('@/components/Reference/referenceFormatting', () => ({ createReferenceTitle: () => 'Reference title' }))
jest.mock('@/hooks/useReturnNavigation', () => ({ useReturnNavigation: () => ({ fallbackTarget: '/reference' }) }))
jest.mock('@/components/TimeBound/TimeBoundTable', () => ({ TimeBoundTable: () => <div>TimeBound Table</div> }))
jest.mock('@/components/Page', () => ({
  usePageContext: () => ({
    editRights: { delete: true, edit: true },
    previousTableUrls: [],
    setPreviousTableUrls: jest.fn(),
    viewName: 'reference',
    idList: [],
    setIdList: jest.fn(),
    idFieldName: 'rid',
    createTitle: jest.fn(),
    createSubtitle: jest.fn(),
    sqlLimit: 25,
    sqlOffset: 0,
    sqlColumnFilters: [],
    sqlOrderBy: [],
    setSqlLimit: jest.fn(),
    setSqlOffset: jest.fn(),
    setSqlColumnFilters: jest.fn(),
    setSqlOrderBy: jest.fn(),
  }),
}))

const conflictError = Object.assign(new Error('The Reference with associated updates cannot be deleted.'), {
  status: 409,
  data: { message: 'The Reference with associated updates cannot be deleted.' },
})

describe('ReferenceDetails deletion', () => {
  const originalConfirm = window.confirm
  const mockDeleteTrigger = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useGetReferenceDetailsQuery as jest.Mock).mockReturnValue({
      isFetching: false,
      isError: false,
      data: {
        rid: 1,
        ref_authors: [],
        ref_journal: { journal_id: 1, journal_title: '', short_title: '', alt_title: '', ISSN: '' },
        ref_ref_type: { ref_type: '' },
        exact_date: null,
      } as unknown as ReferenceDetailsType,
    })
    ;(useEditReferenceMutation as jest.Mock).mockReturnValue([
      jest.fn(() => ({ unwrap: jest.fn() })),
      { isLoading: false },
    ])
    mockDeleteTrigger.mockReturnValue({ unwrap: () => Promise.reject(conflictError) })
    ;(useDeleteReferenceMutation as jest.Mock).mockReturnValue([
      mockDeleteTrigger,
      { isSuccess: false, error: conflictError },
    ])
    window.confirm = jest.fn(() => true)
  })

  afterEach(() => {
    window.confirm = originalConfirm
  })

  it('shows a conflict message when deletion fails due to linked updates', async () => {
    const user = userEvent.setup()

    render(
      <NotificationContextProvider>
        <Notification />
        <MemoryRouter initialEntries={[{ pathname: '/reference/1' }]}>
          <Routes>
            <Route path="/reference/:id" element={<ReferenceDetails />} />
          </Routes>
        </MemoryRouter>
      </NotificationContextProvider>
    )

    await user.click(await screen.findByRole('button', { name: /delete/i }))

    await waitFor(() => {
      expect(screen.getByText('The Reference with associated updates cannot be deleted.')).toBeTruthy()
    })
  })
})
