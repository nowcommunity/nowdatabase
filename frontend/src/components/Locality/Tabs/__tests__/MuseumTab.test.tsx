import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { MuseumTab } from '../MuseumTab'
import { useDetailContext, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import { useEditMuseumMutation, useGetAllMuseumsQuery } from '@/redux/museumReducer'
import { useNotify } from '@/hooks/notification'
import type { Museum } from '@/shared/types'

jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  useDetailContext: jest.fn(),
  modeOptionToMode: {
    new: { read: false, staging: false, new: true, option: 'new' },
    read: { read: true, staging: false, new: false, option: 'read' },
    edit: { read: false, staging: false, new: false, option: 'edit' },
    'staging-edit': { read: false, staging: true, new: false, option: 'staging-edit' },
    'staging-new': { read: false, staging: true, new: true, option: 'staging-new' },
  },
}))

jest.mock('@/redux/museumReducer', () => ({
  useGetAllMuseumsQuery: jest.fn(),
  useEditMuseumMutation: jest.fn(),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: jest.fn(),
}))

jest.mock('@/components/DetailView/common/tabLayoutHelpers', () => ({
  Grouped: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/DetailView/common/EditableTable', () => ({
  EditableTable: () => <div data-testid="editable-table" />,
}))

jest.mock('@/components/DetailView/common/SelectingTable', () => ({
  SelectingTable: () => <div data-testid="selecting-table" />,
}))

jest.mock('@/components/DetailView/common/EditingModal', () => ({
  EditingModal: ({
    children,
    buttonText,
    onSave,
  }: {
    children: ReactNode
    buttonText: string
    onSave?: () => Promise<boolean>
  }) => (
    <div data-testid="editing-modal" data-button-text={buttonText}>
      {children}
      {onSave && (
        <button type="button" onClick={() => void onSave()}>
          Save
        </button>
      )}
    </div>
  ),
}))

const mockUseDetailContext = useDetailContext as jest.MockedFunction<typeof useDetailContext>
const mockUseGetAllMuseumsQuery = useGetAllMuseumsQuery as jest.MockedFunction<typeof useGetAllMuseumsQuery>
const mockUseEditMuseumMutation = useEditMuseumMutation as jest.MockedFunction<typeof useEditMuseumMutation>
const mockUseNotify = useNotify as jest.MockedFunction<typeof useNotify>

describe('MuseumTab create flow', () => {
  const setEditData = jest.fn<(value: unknown) => void>()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseNotify.mockReturnValue({ notify: jest.fn() } as never)
  })

  it('creates a museum and links it to the locality', async () => {
    const createdMuseum = {
      museum: 'AM',
      institution: 'Test Institute',
      alt_int_name: null,
      city: 'Helsinki',
      country: 'Finland',
      state: null,
      state_code: null,
    } as Museum

    const editMuseumRequest = jest.fn().mockReturnValue({
      unwrap: jest.fn(() => Promise.resolve({ museum: createdMuseum.museum })),
    })

    const refetchMuseums = jest.fn(() => Promise.resolve({ data: [createdMuseum] }))

    mockUseEditMuseumMutation.mockReturnValue([editMuseumRequest, { isLoading: false }] as never)
    mockUseGetAllMuseumsQuery.mockReturnValue({
      data: [],
      isError: false,
      refetch: refetchMuseums,
    } as never)

    mockUseDetailContext.mockReturnValue({
      mode: modeOptionToMode.edit,
      editData: { lid: 123, now_mus: [] },
      setEditData,
    } as never)

    render(<MuseumTab />)

    fireEvent.change(screen.getByLabelText('Institution'), { target: { value: createdMuseum.institution } })
    fireEvent.change(screen.getByLabelText('Alt. name'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('City'), { target: { value: createdMuseum.city } })
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: createdMuseum.country } })
    fireEvent.change(screen.getByLabelText('State'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('State code'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Museum code'), { target: { value: createdMuseum.museum } })

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(editMuseumRequest).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(setEditData).toHaveBeenCalledWith({
        lid: 123,
        now_mus: [
          {
            lid: 123,
            museum: createdMuseum.museum,
            com_mlist: createdMuseum,
            rowState: 'new',
          },
        ],
      })
    })

    expect(refetchMuseums).toHaveBeenCalled()
  })
})
