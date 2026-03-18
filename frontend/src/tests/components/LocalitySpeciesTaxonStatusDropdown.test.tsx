import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { useState, type ChangeEvent, type ReactNode } from 'react'
import { SpeciesTab } from '@/components/Locality/Tabs/SpeciesTab'
import {
  useDetailContext,
  type DetailContextType,
  modeOptionToMode,
} from '@/components/DetailView/Context/DetailContext'
import type { EditDataType, LocalityDetailsType } from '@/shared/types'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { useNotify } from '@/hooks/notification'
import { taxonStatusSelectLabels } from '@/constants/taxonStatusOptions'
import { PageContext, type PageContextType } from '@/components/Page'
import { store } from '@/redux/store'

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

jest.mock('@/redux/speciesReducer', () => ({
  useGetAllSpeciesQuery: jest.fn(),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: jest.fn(),
}))

jest.mock('@/components/DetailView/common/EditingForm', () => ({
  EditingForm: ({
    buttonText,
    editAction,
  }: {
    buttonText: string
    editAction?: (value: Record<string, unknown>) => void
  }) => {
    const [open, setOpen] = useState(false)
    const [values, setValues] = useState<Record<string, unknown>>({
      unique_identifier: '-',
      taxonomic_status: '',
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = event.target
      setValues(current => ({ ...current, [name]: value }))
    }

    return (
      <div>
        <button type="button" onClick={() => setOpen(true)}>
          {buttonText}
        </button>
        {open ? (
          <div>
            <label>
              Order
              <input name="order_name" value={String(values.order_name ?? '')} onChange={handleChange} />
            </label>
            <label>
              Family
              <input name="family_name" value={String(values.family_name ?? '')} onChange={handleChange} />
            </label>
            <label>
              Genus
              <input name="genus_name" value={String(values.genus_name ?? '')} onChange={handleChange} />
            </label>
            <label>
              Species
              <input name="species_name" value={String(values.species_name ?? '')} onChange={handleChange} />
            </label>
            <label>
              Taxon status
              <select name="taxonomic_status" value={String(values.taxonomic_status ?? '')} onChange={handleChange}>
                {taxonStatusSelectLabels.map(label => (
                  <option key={label} value={label === 'No value' ? '' : label}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                editAction?.(values)
                setOpen(false)
              }}
            >
              Save
            </button>
          </div>
        ) : null}
      </div>
    )
  },
}))

jest.mock('@/components/DetailView/common/EditingModal', () => ({
  EditingModal: ({
    buttonText,
    children,
    onSave,
  }: {
    buttonText: string
    children: ReactNode
    onSave?: () => Promise<boolean>
  }) => {
    const [open, setOpen] = useState(false)

    return (
      <div>
        <button type="button" onClick={() => setOpen(true)}>
          {buttonText}
        </button>
        {open ? (
          <div>
            {children}
            {onSave ? (
              <button
                type="button"
                onClick={async () => {
                  const shouldClose = await onSave()
                  if (shouldClose) setOpen(false)
                }}
              >
                Save
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  },
}))

jest.mock('@/components/DetailView/common/EditableTable', () => ({
  EditableTable: () => <div data-testid="editable-table" />,
}))

jest.mock('@/components/DetailView/common/SelectingTable', () => ({
  SelectingTable: ({ buttonText }: { buttonText: string }) => <button type="button">{buttonText}</button>,
}))

jest.mock('@/components/Species/SynonymsModal', () => ({
  SynonymsModal: () => null,
}))

jest.mock('@/util/taxonomyUtilities', () => ({
  checkSpeciesTaxonomy: jest.fn(() => new Set()),
  convertSpeciesTaxonomyFields: jest.fn((fields: Record<string, unknown>) => {
    const { rowState, ...rest } = fields
    return rest
  }),
  fixNullValuesInTaxonomyFields: jest.fn(value => value),
}))

jest.mock('@/shared/validators/species', () => ({
  validateSpecies: jest.fn(() => ({ name: '', error: null })),
}))

const mockUseDetailContext = useDetailContext as jest.MockedFunction<() => DetailContextType<LocalityDetailsType>>
const mockUseGetAllSpeciesQuery = useGetAllSpeciesQuery as jest.MockedFunction<typeof useGetAllSpeciesQuery>
const mockUseNotify = useNotify as jest.MockedFunction<typeof useNotify>

const setEditData = jest.fn()

const pageContextValue: PageContextType<unknown> = {
  idList: [],
  setIdList: jest.fn(),
  idFieldName: 'lid',
  viewName: 'locality',
  previousTableUrls: [],
  setPreviousTableUrls: jest.fn(),
  createTitle: () => '',
  createSubtitle: () => '',
  editRights: { edit: true, delete: true },
  sqlLimit: 20,
  sqlOffset: 0,
  sqlColumnFilters: [],
  sqlOrderBy: [],
  setSqlLimit: jest.fn(),
  setSqlOffset: jest.fn(),
  setSqlColumnFilters: jest.fn(),
  setSqlOrderBy: jest.fn(),
}

const createContextValue = (): DetailContextType<LocalityDetailsType> => ({
  data: { lid: 1, now_ls: [] } as unknown as LocalityDetailsType,
  mode: modeOptionToMode.edit,
  setMode: jest.fn(),
  editData: { lid: 1, now_ls: [] } as unknown as EditDataType<LocalityDetailsType>,
  setEditData,
  textField: (() => <span />) as DetailContextType<LocalityDetailsType>['textField'],
  bigTextField: (() => <span />) as DetailContextType<LocalityDetailsType>['bigTextField'],
  dropdown: (() => <span />) as DetailContextType<LocalityDetailsType>['dropdown'],
  dropdownWithSearch: (() => <span />) as DetailContextType<LocalityDetailsType>['dropdownWithSearch'],
  radioSelection: (() => <span />) as DetailContextType<LocalityDetailsType>['radioSelection'],
  validator: (() => ({ name: '', error: null })) as DetailContextType<LocalityDetailsType>['validator'],
  fieldsWithErrors: {},
  setFieldsWithErrors: jest.fn(),
  isDirty: false,
  resetEditData: jest.fn(),
})
describe('SpeciesTab taxon status dropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setEditData.mockClear()
    mockUseDetailContext.mockReturnValue(createContextValue())
    const speciesQueryMock = { data: [], isError: false } as unknown as ReturnType<typeof useGetAllSpeciesQuery>
    mockUseGetAllSpeciesQuery.mockReturnValue(speciesQueryMock)
    mockUseNotify.mockReturnValue({ notify: jest.fn(), setMessage: jest.fn() })
  })

  it('renders taxon status as a dropdown and submits the selected value', async () => {
    const user = userEvent.setup()

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PageContext.Provider value={pageContextValue}>
            <SpeciesTab />
          </PageContext.Provider>
        </MemoryRouter>
      </Provider>
    )

    await user.click(screen.getByRole('button', { name: /add new species/i }))

    const taxonStatusField = screen.getByLabelText(/taxon status/i)
    await user.click(taxonStatusField)

    const taxonStatusOptions = await screen.findAllByRole('option')
    const optionLabels = taxonStatusOptions.map(option => option.textContent)

    expect(optionLabels).toEqual(taxonStatusSelectLabels)

    const noValueOption = taxonStatusOptions.find(option => option.textContent === 'No value')
    const nowSynonymOption = taxonStatusOptions.find(option => option.textContent === 'NOW synonym')

    expect(noValueOption).toBeDefined()
    expect(nowSynonymOption).toBeDefined()
    await user.click(nowSynonymOption!)

    await user.type(screen.getByLabelText(/^order$/i), 'Carnivora')
    await user.type(screen.getByLabelText(/^family$/i), 'Felidae')
    await user.type(screen.getByLabelText(/^genus$/i), 'Panthera')
    await user.type(screen.getByLabelText(/^species$/i), 'leo')

    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(setEditData).toHaveBeenCalled()
    })

    const savedEditData = setEditData.mock.calls[0][0] as EditDataType<LocalityDetailsType>
    const savedSpecies = (savedEditData.now_ls as unknown as Array<{ com_species: { taxonomic_status?: string } }>)[0]

    expect(savedSpecies.com_species.taxonomic_status).toBe('NOW synonym')
  })
})
