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
    const editAction = jest.fn<(newObject: FormValues) => void>()
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

  it('shows field information for known add-form fields', async () => {
    const user = userEvent.setup()
    const formFields: EditingFormField[] = [{ name: 'author_surname', label: 'Surname' }]

    mockUseDetailContext.mockReturnValue(createContextValue())

    render(
      <EditingForm<{ author_surname: string }, ParentType>
        buttonText="Add new author"
        formFields={formFields}
        editAction={jest.fn<(newObject: { author_surname: string }) => void>()}
      />
    )

    await user.click(screen.getByRole('button', { name: /add new author/i }))

    expect(screen.getByLabelText('Field information for Surname')).toBeTruthy()
  })

  it('keeps the form open and preserves values when the edit action rejects submission', async () => {
    const user = userEvent.setup()
    const editAction = jest.fn<(newObject: { unique_identifier: string }) => boolean>(() => false)
    const formFields: EditingFormField[] = [{ name: 'unique_identifier', label: 'Unique Identifier', required: true }]

    mockUseDetailContext.mockReturnValue(createContextValue())

    render(
      <EditingForm<{ unique_identifier: string }, ParentType>
        buttonText="Add new Species"
        formFields={formFields}
        editAction={editAction}
      />
    )

    await user.click(screen.getByRole('button', { name: /add new species/i }))
    const identifierField = screen.getByRole('textbox', { name: /unique identifier/i })
    await user.type(identifierField, ' ')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(editAction).toHaveBeenCalledWith({ unique_identifier: ' ', rowState: 'new' })
    })
    expect(screen.getByRole('button', { name: /cancel/i })).toBeTruthy()
    expect((identifierField as HTMLInputElement).value).toBe(' ')
  })

  it('requires acknowledgement for the current form value before saving', async () => {
    const user = userEvent.setup()
    const editAction = jest.fn<(newObject: { unique_identifier: string }) => void>()
    const getConfirmation = (values: { unique_identifier: string }) =>
      values.unique_identifier?.startsWith('conflict')
        ? { key: values.unique_identifier, message: 'Family Felidae belongs to order Carnivora, not Rodentia.' }
        : undefined

    mockUseDetailContext.mockReturnValue(createContextValue())

    render(
      <EditingForm<{ unique_identifier: string }, ParentType>
        buttonText="Add new Species"
        formFields={[{ name: 'unique_identifier', label: 'Unique Identifier', required: true }]}
        editAction={editAction}
        getConfirmation={getConfirmation}
      />
    )

    await user.click(screen.getByRole('button', { name: /add new species/i }))
    const identifierField = screen.getByRole('textbox', { name: /unique identifier/i })
    await user.type(identifierField, 'conflict-one')

    expect(screen.getByText('Family Felidae belongs to order Carnivora, not Rodentia.')).toBeTruthy()
    const saveButton = screen.getByRole('button', { name: /save/i })
    expect((saveButton as HTMLButtonElement).disabled).toBe(true)

    await user.click(screen.getByRole('checkbox', { name: /i understand and want to continue/i }))
    expect((saveButton as HTMLButtonElement).disabled).toBe(false)

    await user.clear(identifierField)
    await user.type(identifierField, 'conflict-two')
    expect((saveButton as HTMLButtonElement).disabled).toBe(true)

    await user.click(screen.getByRole('checkbox', { name: /i understand and want to continue/i }))
    await user.click(saveButton)

    await waitFor(() => {
      expect(editAction).toHaveBeenCalledWith({ unique_identifier: 'conflict-two', rowState: 'new' })
    })
  })
})
