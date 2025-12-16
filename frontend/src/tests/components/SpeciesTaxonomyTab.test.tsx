import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react'
import { TaxonomyTab } from '@/components/Species/Tabs/TaxonomyTab'
import {
  modeOptionToMode,
  type DetailContextType,
  useDetailContext,
} from '@/components/DetailView/Context/DetailContext'
import type { EditDataType, SpeciesDetailsType } from '@/shared/types'
import { taxonStatusOptions } from '@/shared/taxonStatusOptions'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'

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

jest.mock('@/components/DetailView/common/SelectingTable', () => ({
  SelectingTable: () => <div data-testid="selecting-table" />,
}))

jest.mock('@/components/Species/SynonymsModal', () => ({
  SynonymsModal: () => <div data-testid="synonyms-modal" />,
}))

jest.mock('@/util/taxonomyUtilities', () => ({
  fixNullValuesInTaxonomyFields: (value: unknown) => value,
}))

const mockUseDetailContext = useDetailContext as jest.MockedFunction<() => DetailContextType<SpeciesDetailsType>>
const mockUseGetAllSpeciesQuery = useGetAllSpeciesQuery as jest.MockedFunction<typeof useGetAllSpeciesQuery>

describe('TaxonomyTab taxon status options', () => {
  const dropdown = jest.fn((name: string) => <div data-testid={`dropdown-${name}`} />)
  const textField = jest.fn((name: string) => <div data-testid={`text-${name}`} />)
  const bigTextField = jest.fn((name: string) => <div data-testid={`bigtext-${name}`} />)

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseDetailContext.mockReturnValue({
      data: {} as SpeciesDetailsType,
      editData: {} as EditDataType<SpeciesDetailsType>,
      setEditData: jest.fn(),
      mode: modeOptionToMode.new,
      setMode: jest.fn(),
      textField,
      dropdown,
      dropdownWithSearch: jest.fn(() => <div data-testid="dropdown-with-search" />),
      radioSelection: jest.fn(() => <div data-testid="radio-selection" />),
      bigTextField,
      validator: jest.fn(() => ({ name: '', error: null })),
      fieldsWithErrors: {},
      setFieldsWithErrors: jest.fn(),
      isDirty: false,
      resetEditData: jest.fn(),
    })
    mockUseGetAllSpeciesQuery.mockReturnValue({ data: [], isError: false } as never)
  })

  it('uses the centralized taxon status options for the dropdown', () => {
    render(<TaxonomyTab />)

    expect(dropdown).toHaveBeenCalledWith('taxonomic_status', taxonStatusOptions, 'Taxonomic Status')
  })
})
