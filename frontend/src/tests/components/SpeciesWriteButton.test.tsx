import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { WriteButton } from '@/components/DetailView/components'
import { EditDataType, Species } from '@/shared/types'
import { useDetailContext, type DetailContextType } from '@/components/DetailView/Context/DetailContext'
import { useGetAllSpeciesQuery, useGetAllSynonymsQuery } from '@/redux/speciesReducer'
import { checkSpeciesTaxonomy } from '@/util/taxonomyUtilities'

const mockNotify = jest.fn()

jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  useDetailContext: jest.fn(),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: mockNotify }),
}))

jest.mock('@/redux/speciesReducer', () => ({
  useGetAllSpeciesQuery: jest.fn(),
  useGetAllSynonymsQuery: jest.fn(),
}))

jest.mock('@/util/taxonomyUtilities', () => {
  const actual = jest.requireActual<typeof import('@/util/taxonomyUtilities')>('@/util/taxonomyUtilities')
  return {
    ...actual,
    checkSpeciesTaxonomy: jest.fn(),
    convertSpeciesTaxonomyFields: jest.fn(actual.convertSpeciesTaxonomyFields),
  }
})

const mockUseDetailContext = useDetailContext as jest.MockedFunction<() => DetailContextType<Species>>
const mockUseGetAllSpeciesQuery = useGetAllSpeciesQuery as jest.MockedFunction<typeof useGetAllSpeciesQuery>
const mockUseGetAllSynonymsQuery = useGetAllSynonymsQuery as jest.MockedFunction<typeof useGetAllSynonymsQuery>
const mockCheckSpeciesTaxonomy = checkSpeciesTaxonomy as jest.MockedFunction<typeof checkSpeciesTaxonomy>

const modeEdit = { read: false, staging: false, new: false, option: 'edit' as const }

const textField: DetailContextType<Species>['textField'] = () => <span />
const bigTextField: DetailContextType<Species>['bigTextField'] = () => <span />
const dropdown: DetailContextType<Species>['dropdown'] = () => <span />
const dropdownWithSearch: DetailContextType<Species>['dropdownWithSearch'] = () => <span />
const radioSelection: DetailContextType<Species>['radioSelection'] = () => <span />
const validator: DetailContextType<Species>['validator'] = () => ({ name: '', error: null })

const baseSpecies: Species = {
  species_id: 1,
  subclass_or_superorder_name: '',
  order_name: 'Primates',
  suborder_or_superfamily_name: '',
  family_name: 'Hominidae',
  subfamily_name: 'Homininae',
  genus_name: 'Pan',
  species_name: 'troglodytes',
  unique_identifier: 'Pan troglodytes',
  taxonomic_status: 'valid',
  sv_length: '',
  body_mass: 0,
  sd_size: '',
  sd_display: '',
  tshm: '',
  tht: '',
  horizodonty: '',
  crowntype: '',
  cusp_shape: '',
  cusp_count_buccal: '',
  cusp_count_lingual: '',
  loph_count_lon: '',
  loph_count_trs: '',
  fct_al: '',
  fct_ol: '',
  fct_sf: '',
  fct_ot: '',
  fct_cm: '',
  microwear: '',
  mesowear: '',
  mw_or_high: 0,
  mw_or_low: 0,
  mw_cs_sharp: 0,
  mw_cs_round: 0,
  mw_cs_blunt: 0,
  diet1: '',
  diet2: '',
  diet3: '',
  locomo1: '',
  locomo2: '',
  locomo3: '',
  sp_author: '',
  sp_comment: 'Existing comment',
}

const renderButton = (
  editData: EditDataType<Species>,
  onWrite = jest.fn(() => Promise.resolve()),
  overrides?: Partial<DetailContextType<Species>>
) => {
  mockUseDetailContext.mockReturnValue({
    data: baseSpecies,
    mode: modeEdit,
    setMode: jest.fn(),
    editData,
    setEditData: jest.fn(),
    textField,
    bigTextField,
    dropdown,
    dropdownWithSearch,
    radioSelection,
    validator,
    fieldsWithErrors: {},
    setFieldsWithErrors: jest.fn(),
    ...overrides,
  })

  mockUseGetAllSpeciesQuery.mockReturnValue({ data: [baseSpecies] } as never)
  mockUseGetAllSynonymsQuery.mockReturnValue({ data: [] } as never)

  return render(<WriteButton onWrite={onWrite} taxonomy />)
}

describe('WriteButton taxonomy handling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('skips duplicate taxonomy validation when taxonomy fields are unchanged', async () => {
    const onWrite = jest.fn(() => Promise.resolve())
    mockCheckSpeciesTaxonomy.mockReturnValue(new Set(['The taxon already exists in the database.']))

    renderButton({ ...baseSpecies, sp_comment: 'Updated comment' } as EditDataType<Species>, onWrite)

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(onWrite).toHaveBeenCalledTimes(1)
    })
    expect(mockCheckSpeciesTaxonomy).not.toHaveBeenCalled()
    expect(mockNotify).not.toHaveBeenCalledWith(expect.stringContaining('taxon already exists'))
  })

  it('runs duplicate taxonomy validation when taxonomy fields change', async () => {
    const onWrite = jest.fn(() => Promise.resolve())
    mockCheckSpeciesTaxonomy.mockReturnValue(new Set(['The taxon already exists in the database.']))

    renderButton({ ...baseSpecies, genus_name: 'Gorilla' } as EditDataType<Species>, onWrite)

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(mockCheckSpeciesTaxonomy).toHaveBeenCalledTimes(1)
    })
    expect(onWrite).not.toHaveBeenCalled()
    expect(mockNotify).toHaveBeenCalledWith(expect.stringContaining('taxon already exists'), 'error', null)
  })

  it('converts a cleared comment field to null so it can be persisted', async () => {
    const onWrite = jest.fn(() => Promise.resolve())
    const setEditData = jest.fn()

    renderButton({ ...baseSpecies, sp_comment: '' } as EditDataType<Species>, onWrite, { setEditData })

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(onWrite).toHaveBeenCalledTimes(1)
    })

    expect(onWrite).toHaveBeenCalledWith(expect.objectContaining({ sp_comment: null }), expect.any(Function))
    expect(setEditData).toHaveBeenCalledWith(expect.objectContaining({ sp_comment: null }))
  })
})
