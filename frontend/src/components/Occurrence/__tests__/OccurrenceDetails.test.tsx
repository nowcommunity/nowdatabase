import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { OccurrenceDetails } from '../OccurrenceDetails'
import { useOccurrenceDetails } from '@/hooks/useOccurrenceDetails'

const notify = jest.fn()

jest.mock('@/hooks/useOccurrenceDetails', () => ({
  useOccurrenceDetails: jest.fn(),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify, setMessage: jest.fn() }),
  getErrorMessage: (error: { message?: string }, fallback: string) => error.message ?? fallback,
}))

jest.mock('../Tabs/OccurrenceCoreTab', () => ({ OccurrenceCoreTab: () => <div>Occurrence tab</div> }))
jest.mock('../Tabs/OccurrenceWearTab', () => ({ OccurrenceWearTab: () => <div>Wear tab</div> }))
jest.mock('../Tabs/OccurrenceIsotopeTab', () => ({ OccurrenceIsotopeTab: () => <div>Isotope tab</div> }))
jest.mock('@/components/DetailView/common/UpdateTab', () => ({ UpdateTab: () => <div>Updates placeholder</div> }))

jest.mock('@/components/DetailView/DetailView', () => ({
  DetailView: ({
    tabs,
    onWrite,
    data,
  }: {
    tabs: Array<{ title: string }>
    onWrite?: (data: unknown) => Promise<void>
    data: unknown
  }) => (
    <div data-testid="occurrence-detail-view">
      <div>{tabs.map(tab => tab.title).join('|')}</div>
      <button
        data-testid="trigger-on-write"
        onClick={() => {
          if (onWrite) {
            void onWrite(data).catch(() => undefined)
          }
        }}
      >
        trigger-on-write
      </button>
    </div>
  ),
}))

const mockUseOccurrenceDetails = useOccurrenceDetails as jest.MockedFunction<typeof useOccurrenceDetails>

const occurrenceData = {
  lid: 1,
  species_id: 2,
  loc_status: false,
  loc_name: 'Loc',
  country: 'Country',
  genus_name: 'Genus',
  family_name: 'Family',
  species_name: 'species',
  unique_identifier: null,
  dms_lat: null,
  dms_long: null,
  bfa_max: null,
  bfa_min: null,
  max_age: null,
  min_age: null,
  nis: null,
  pct: null,
  quad: null,
  mni: null,
  qua: null,
  id_status: null,
  orig_entry: null,
  source_name: null,
  body_mass: null,
  mesowear: null,
  mw_or_high: null,
  mw_or_low: null,
  mw_cs_sharp: null,
  mw_cs_round: null,
  mw_cs_blunt: null,
  mw_scale_min: null,
  mw_scale_max: null,
  mw_value: null,
  microwear: null,
  dc13_mean: null,
  dc13_n: null,
  dc13_max: null,
  dc13_min: null,
  dc13_stdev: null,
  do18_mean: null,
  do18_n: null,
  do18_max: null,
  do18_min: null,
  do18_stdev: null,
  now_oau: [],
}

describe('OccurrenceDetails', () => {
  beforeEach(() => {
    mockUseOccurrenceDetails.mockReset()
    notify.mockReset()
  })

  it('renders occurrence tabs including Updates placeholder tab', () => {
    mockUseOccurrenceDetails.mockReturnValue({
      occurrence: occurrenceData,
      isLoading: false,
      isError: false,
      isSaving: false,
      refetch: jest.fn(() => Promise.resolve(undefined)),
      saveOccurrence: jest.fn(() => Promise.resolve({ lid: 1, species_id: 2 } as never)),
    })

    render(
      <MemoryRouter initialEntries={['/occurrence/1/2?tab=3']}>
        <Routes>
          <Route path="/occurrence/:lid/:speciesId" element={<OccurrenceDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('occurrence-detail-view').textContent).toContain('Occurrence|Wear|Isotopes|Updates')
  })

  it('shows success notification after successful save', async () => {
    const saveOccurrence = jest.fn(() => Promise.resolve({ ...occurrenceData } as never))

    mockUseOccurrenceDetails.mockReturnValue({
      occurrence: occurrenceData,
      isLoading: false,
      isError: false,
      isSaving: false,
      refetch: jest.fn(() => Promise.resolve(undefined)),
      saveOccurrence,
    })

    render(
      <MemoryRouter initialEntries={['/occurrence/1/2']}>
        <Routes>
          <Route path="/occurrence/:lid/:speciesId" element={<OccurrenceDetails />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTestId('trigger-on-write'))

    await waitFor(() => {
      expect(saveOccurrence).toHaveBeenCalledTimes(1)
      expect(notify).toHaveBeenCalledWith('Occurrence entry finalized successfully.')
    })
  })

  it('shows validation message when save fails', async () => {
    const saveOccurrence = jest.fn(() => Promise.reject(new Error('Validation failed: Quantity is required')))

    mockUseOccurrenceDetails.mockReturnValue({
      occurrence: occurrenceData,
      isLoading: false,
      isError: false,
      isSaving: false,
      refetch: jest.fn(() => Promise.resolve(undefined)),
      saveOccurrence,
    })

    render(
      <MemoryRouter initialEntries={['/occurrence/1/2']}>
        <Routes>
          <Route path="/occurrence/:lid/:speciesId" element={<OccurrenceDetails />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTestId('trigger-on-write'))

    await waitFor(() => {
      expect(saveOccurrence).toHaveBeenCalledTimes(1)
      expect(notify).toHaveBeenCalledWith('Validation failed: Quantity is required', 'error')
    })
  })
})
