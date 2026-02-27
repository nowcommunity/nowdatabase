import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { OccurrenceDetails } from '../OccurrenceDetails'
import { useOccurrenceDetails } from '@/hooks/useOccurrenceDetails'

jest.mock('@/hooks/useOccurrenceDetails', () => ({
  useOccurrenceDetails: jest.fn(),
}))

jest.mock('../Tabs/OccurrenceCoreTab', () => ({ OccurrenceCoreTab: () => <div>Core tab</div> }))
jest.mock('../Tabs/OccurrenceWearTab', () => ({ OccurrenceWearTab: () => <div>Wear tab</div> }))
jest.mock('../Tabs/OccurrenceIsotopeTab', () => ({ OccurrenceIsotopeTab: () => <div>Isotope tab</div> }))
jest.mock('@/components/DetailView/common/UpdateTab', () => ({ UpdateTab: () => <div>Updates placeholder</div> }))

jest.mock('@/components/DetailView/DetailView', () => ({
  DetailView: ({ tabs }: { tabs: Array<{ title: string }> }) => (
    <div data-testid="occurrence-detail-view">{tabs.map(tab => tab.title).join('|')}</div>
  ),
}))

const mockUseOccurrenceDetails = useOccurrenceDetails as jest.MockedFunction<typeof useOccurrenceDetails>

describe('OccurrenceDetails', () => {
  beforeEach(() => {
    mockUseOccurrenceDetails.mockReset()
  })

  it('renders occurrence tabs including Updates placeholder tab', () => {
    mockUseOccurrenceDetails.mockReturnValue({
      occurrence: {
        lid: 1,
        species_id: 2,
        loc_status: false,
        loc_name: 'Loc',
        country: 'Country',
        genus_name: 'Genus',
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
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(() => Promise.resolve(undefined)),
    })

    render(
      <MemoryRouter initialEntries={['/occurrence/1/2?tab=3']}>
        <Routes>
          <Route path="/occurrence/:lid/:speciesId" element={<OccurrenceDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('occurrence-detail-view').textContent).toBe('Core|Wear|Isotopes|Updates')
  })
})
