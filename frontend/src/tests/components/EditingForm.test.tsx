import { describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditingForm, type EditingFormField } from '@/components/DetailView/common/EditingForm'
import {
  useDetailContext,
  type DetailContextType,
  modeOptionToMode,
} from '@/components/DetailView/Context/DetailContext'
import type { EditDataType } from '@/shared/types'

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

type FormValues = { taxonomic_status: string }
type ParentType = { species: FormValues[] }

const mockUseDetailContext = useDetailContext as jest.MockedFunction<() => DetailContextType<ParentType>>

const createContextValue = (): DetailContextType<ParentType> => ({
  data: { species: [] },
  mode: modeOptionToMode.edit,
  setMode: jest.fn(),
  editData: { species: [] } as EditDataType<ParentType>,
  setEditData: jest.fn(),
  textField: (() => <span />) as DetailContextType<ParentType>['textField'],
  bigTextField: (() => <span />) as DetailContextType<ParentType>['bigTextField'],
  dropdown: (() => <span />) as DetailContextType<ParentType>['dropdown'],
  dropdownWithSearch: (() => <span />) as DetailContextType<ParentType>['dropdownWithSearch'],
  radioSelection: (() => <span />) as DetailContextType<ParentType>['radioSelection'],
  validator: (() => ({ name: '', error: null })) as DetailContextType<ParentType>['validator'],
  fieldsWithErrors: {},
  setFieldsWithErrors: jest.fn(),
  isDirty: false,
  resetEditData: jest.fn(),
})

describe('EditingForm select support', () => {
  it('renders a select field and submits the selected value', async () => {
    const user = userEvent.setup()
    const editAction = jest.fn()
    const formFields: EditingFormField[] = [
      {
        name: 'taxonomic_status',
        label: 'Taxon status',
        required: true,
        selectOptions: [
          { value: '', label: 'No value' },
          { value: 'informal species', label: 'Informal species' },
        ],
      },
    ]

    mockUseDetailContext.mockReturnValue(createContextValue())

    render(
      <EditingForm<FormValues, ParentType>
        buttonText="Add new Species"
        formFields={formFields}
        editAction={editAction}
      />
    )

    await user.click(screen.getByRole('button', { name: /add new species/i }))

    const selectField = screen.getByLabelText(/taxon status/i)
    await user.click(selectField)

    const listbox = within(screen.getByRole('presentation')).getByRole('listbox')
    await user.click(within(listbox).getByRole('option', { name: /informal species/i }))

    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(editAction).toHaveBeenCalledWith({ taxonomic_status: 'informal species', rowState: 'new' })
    })
  })
})
