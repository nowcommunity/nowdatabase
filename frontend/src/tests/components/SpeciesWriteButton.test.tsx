import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WriteButton } from '@/components/DetailView/components'
import { EditDataType, Role, Species } from '@/shared/types'
import { useDetailContext, type DetailContextType } from '@/components/DetailView/Context/DetailContext'
import { useGetAllSpeciesQuery, useGetAllSynonymsQuery } from '@/redux/speciesReducer'
import { checkSpeciesTaxonomy } from '@/util/taxonomyUtilities'
import { useUser } from '@/hooks/user'
import { UserState } from '@/redux/userReducer'

const mockNotify = jest.fn()

jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  useDetailContext: jest.fn(),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: mockNotify }),
}))

jest.mock('@/hooks/user', () => ({
  useUser: jest.fn(),
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
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>

const modeEdit = { read: false, staging: false, new: false, option: 'edit' as const }
const modeNew = { read: false, staging: false, new: true, option: 'new' as const }
const modeStagingEdit = { read: false, staging: true, new: false, option: 'staging-edit' as const }
const modeStagingNew = { read: false, staging: true, new: true, option: 'staging-new' as const }

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
  overrides?: Partial<DetailContextType<Species>>,
  buttonProps: { taxonomy?: boolean; hasStagingMode?: boolean } = { taxonomy: true }
) => {
  mockUseDetailContext.mockReturnValue({
    data: baseSpecies,
    mode: modeEdit,
    setMode: jest.fn(),
    editData,
    setEditData: jest.fn(),
    isDirty: true,
    resetEditData: jest.fn(),
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

  return render(
    <WriteButton onWrite={onWrite} taxonomy={buttonProps.taxonomy} hasStagingMode={buttonProps.hasStagingMode} />
  )
}

describe('WriteButton behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const mockUser: UserState = {
      token: null,
      username: 'tester',
      role: Role.Admin,
      initials: null,
      localities: [],
      isFirstLogin: undefined,
    }
    mockUseUser.mockReturnValue(mockUser)
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
      expect(mockCheckSpeciesTaxonomy).toHaveBeenCalled()
    })
    expect(onWrite).not.toHaveBeenCalled()
    expect(mockNotify).toHaveBeenCalledWith(expect.stringContaining('taxon already exists'), 'error', null)
  })

  it('allows administrators to save species with a taxonomy hierarchy mismatch', async () => {
    const onWrite = jest.fn(() => Promise.resolve())
    mockCheckSpeciesTaxonomy.mockReturnValue(new Set())

    renderButton({ ...baseSpecies, family_name: 'Canidae' } as EditDataType<Species>, onWrite)

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(onWrite).toHaveBeenCalledTimes(1)
    })
    expect(mockCheckSpeciesTaxonomy).toHaveBeenCalledWith(expect.any(Object), expect.any(Array), expect.any(Array), {
      allowTaxonomyHierarchyMismatch: true,
    })
  })

  it('requires admins to acknowledge a taxonomy mismatch before finalizing a new species', async () => {
    const setMode = jest.fn()
    const onWrite = jest.fn(() => Promise.resolve())
    mockCheckSpeciesTaxonomy.mockImplementation((_species, _existingSpecies, _synonyms, options) => {
      options?.onTaxonomyHierarchyMismatch?.(['Subfamily Caninae belongs to family Canidae, not Felidae.'])
      return new Set()
    })

    renderButton(
      { ...baseSpecies, family_name: 'Canidae' } as EditDataType<Species>,
      onWrite,
      { mode: modeNew, setMode },
      { taxonomy: true, hasStagingMode: true }
    )

    const finalizeButton = screen.getByRole('button', { name: /finalize entry/i })
    expect((finalizeButton as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText(/Subfamily Caninae belongs to family Canidae, not Felidae/i)).toBeTruthy()

    fireEvent.click(screen.getByRole('checkbox', { name: /i understand and want to continue/i }))

    await waitFor(() => {
      expect((finalizeButton as HTMLButtonElement).disabled).toBe(false)
    })
    expect(screen.getByText(/Subfamily Caninae belongs to family Canidae, not Felidae/i)).toBeTruthy()
    expect(screen.getByRole('checkbox')).toHaveProperty('checked', true)

    fireEvent.click(finalizeButton)
    await waitFor(() => {
      expect(setMode).toHaveBeenCalledWith('staging-new')
    })
    expect(onWrite).not.toHaveBeenCalled()
  })

  it('rechecks and requires acknowledgement when only taxonomic status changes', () => {
    const onWrite = jest.fn(() => Promise.resolve())
    mockCheckSpeciesTaxonomy.mockImplementation((_species, _existingSpecies, _synonyms, options) => {
      options?.onTaxonomyHierarchyMismatch?.(['Family Felidae belongs to order Carnivora, not Rodentia.'])
      return new Set()
    })
    const view = renderButton(baseSpecies, onWrite)
    expect(screen.queryByText(/Family Felidae belongs/)).toBeNull()

    const context = mockUseDetailContext()
    mockUseDetailContext.mockReturnValue({
      ...context,
      editData: { ...baseSpecies, taxonomic_status: 'informal species' },
    })
    view.rerender(<WriteButton onWrite={onWrite} taxonomy />)
    expect(screen.getByText(/Family Felidae belongs/)).toBeTruthy()
    expect(screen.getByRole('button', { name: /save changes/i })).toHaveProperty('disabled', true)
    fireEvent.click(screen.getByRole('checkbox', { name: /i understand and want to continue/i }))
    expect(screen.getByRole('button', { name: /save changes/i })).toHaveProperty('disabled', false)

    mockUseDetailContext.mockReturnValue({
      ...context,
      editData: { ...baseSpecies, taxonomic_status: 'nomen dubium' },
    })
    view.rerender(<WriteButton onWrite={onWrite} taxonomy />)
    expect(screen.getByRole('button', { name: /save changes/i })).toHaveProperty('disabled', true)
  })

  it('omits synonyms during the live preview but checks them when saving', async () => {
    const onWrite = jest.fn(() => Promise.resolve())
    const synonyms = [
      { synonym_id: 1, species_id: 1, syn_genus_name: 'Gorilla', syn_species_name: 'troglodytes', syn_comment: null },
    ]
    mockCheckSpeciesTaxonomy.mockImplementation((_species, _existingSpecies, checkedSynonyms) =>
      checkedSynonyms.length ? new Set(['Duplicate synonym']) : new Set()
    )
    const view = renderButton({ ...baseSpecies, genus_name: 'Gorilla' }, onWrite)
    mockUseGetAllSynonymsQuery.mockReturnValue({ data: synonyms } as never)
    view.rerender(<WriteButton onWrite={onWrite} taxonomy />)

    expect(mockCheckSpeciesTaxonomy).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Array),
      [],
      expect.objectContaining({ onTaxonomyHierarchyMismatch: expect.any(Function) })
    )
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    await waitFor(() => {
      expect(mockCheckSpeciesTaxonomy).toHaveBeenCalledWith(expect.any(Object), expect.any(Array), synonyms, {
        allowTaxonomyHierarchyMismatch: true,
      })
    })
    expect(onWrite).not.toHaveBeenCalled()
    expect(mockNotify).toHaveBeenCalledWith('Duplicate synonym', 'error', null)
  })

  it('blocks taxonomy hierarchy mismatches for non-administrators', async () => {
    const onWrite = jest.fn(() => Promise.resolve())
    mockUseUser.mockReturnValue({
      token: null,
      username: 'tester',
      role: Role.EditUnrestricted,
      initials: null,
      localities: [],
      isFirstLogin: undefined,
    })
    mockCheckSpeciesTaxonomy.mockReturnValue(new Set(['Subfamily Caninae belongs to family Canidae, not Felidae.']))

    renderButton({ ...baseSpecies, family_name: 'Felidae' } as EditDataType<Species>, onWrite)

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(mockCheckSpeciesTaxonomy).toHaveBeenCalledWith(expect.any(Object), expect.any(Array), expect.any(Array), {
        allowTaxonomyHierarchyMismatch: false,
      })
    })
    expect(onWrite).not.toHaveBeenCalled()
    expect(mockNotify).toHaveBeenCalledWith(expect.stringContaining('belongs to family'), 'error', null)
  })

  it('converts a cleared comment field to null so it can be persisted', async () => {
    const onWrite = jest.fn(() => Promise.resolve())
    const setEditData = jest.fn()

    renderButton({ ...baseSpecies, sp_comment: '' } as EditDataType<Species>, onWrite, { setEditData })

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(onWrite).toHaveBeenCalledTimes(1)
    })

    expect(onWrite).toHaveBeenCalledWith(expect.objectContaining({ sp_comment: null }), expect.any(Function), undefined)
    expect(setEditData).toHaveBeenCalledWith(expect.objectContaining({ sp_comment: null }))
  })

  it('disables the button when no edits have been made', () => {
    renderButton(baseSpecies as EditDataType<Species>, jest.fn(), { isDirty: false })

    const button = screen.getByRole('button', { name: /save changes/i })
    expect((button as HTMLButtonElement).disabled).toBe(true)
  })

  it('shows helper tooltip when hovering the disabled button', async () => {
    renderButton(baseSpecies as EditDataType<Species>, jest.fn(), { isDirty: false })

    const button = screen.getByRole('button', { name: /save changes/i })
    const tooltipTrigger = button.parentElement

    expect(tooltipTrigger).toBeTruthy()
    fireEvent.mouseOver(tooltipTrigger!)

    await waitFor(() => {
      expect(screen.getByText(/make changes before finalizing the entry/i)).toBeTruthy()
    })
  })

  it('enables the button after edits have been made', () => {
    renderButton(baseSpecies as EditDataType<Species>, jest.fn(), { isDirty: true })

    const button = screen.getByRole('button', { name: /save changes/i })
    expect((button as HTMLButtonElement).disabled).toBe(false)
  })

  it('disables the button in staging mode when no edits have been made', () => {
    const onWrite = jest.fn(() => Promise.resolve())

    renderButton(baseSpecies as EditDataType<Species>, onWrite, {
      isDirty: false,
      mode: modeStagingEdit,
    })

    const button = screen.getByRole('button', { name: /complete and save/i })
    expect((button as HTMLButtonElement).disabled).toBe(true)
  })

  it('only shows the coordinate warning before entering reference staging', async () => {
    const onWrite = jest.fn(() => Promise.resolve())
    const setMode = jest.fn()
    const editData = {
      ...baseSpecies,
      country: 'Finland',
      dec_lat: 0,
      dec_long: 0,
      references: [{ rid: 1, rowState: 'new' as const }],
    } as EditDataType<Species> & {
      country: string
      dec_lat: number
      dec_long: number
      references: Array<{ rid: number; rowState: 'new' }>
    }

    const view = renderButton(editData, onWrite, { mode: modeNew, setMode }, { taxonomy: false, hasStagingMode: true })

    fireEvent.click(screen.getByRole('button', { name: /finalize entry/i }))
    expect(await screen.findByText('Coordinate warning')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Proceed' }))
    await waitFor(() => {
      expect(setMode).toHaveBeenCalledWith('staging-new')
    })
    expect(onWrite).not.toHaveBeenCalled()

    mockUseDetailContext.mockReturnValue({
      data: baseSpecies,
      mode: modeStagingNew,
      setMode,
      editData,
      setEditData: jest.fn(),
      isDirty: true,
      resetEditData: jest.fn(),
      textField,
      bigTextField,
      dropdown,
      dropdownWithSearch,
      radioSelection,
      validator,
      fieldsWithErrors: {},
      setFieldsWithErrors: jest.fn(),
    })
    view.rerender(<WriteButton onWrite={onWrite} hasStagingMode />)

    fireEvent.click(screen.getByRole('button', { name: /complete and save/i }))
    await waitFor(() => {
      expect(onWrite).toHaveBeenCalledTimes(1)
    })
    expect(screen.queryByText('Coordinate warning')).toBeNull()
  })
})
