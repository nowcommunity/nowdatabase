import { ArrayFrame, Grouped } from './common/tabLayoutHelpers'
import { DetailContextProvider, modeOptionToMode, useDetailContext } from './Context/DetailContext'
import { SelectingTable } from './common/SelectingTable'
import { useEditReferenceMutation, useGetAllReferencesQuery, useGetReferenceTypesQuery } from '@/redux/referenceReducer'
import { referenceTableColumns } from '@/common'
import { MRT_RowData } from 'material-react-table'
import { EditDataType, Editable, Reference, ReferenceDetailsType, ReferenceType } from '@/shared/types'
import { EditableTable } from './common/EditableTable'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import { useMemo, useState } from 'react'
import { ReferenceTab } from '@/components/Reference/Tabs/ReferenceTab'
import { emptyReference } from './common/defaultValues'
import {
  DropdownSelector,
  DropdownSelectorWithSearch,
  EditableTextField,
  RadioSelector,
} from './common/editingComponents'
import type { DropdownOption } from './common/editingComponents'
import type { FieldsWithErrorsType, OptionalRadioSelectionProps, TextFieldOptions } from './DetailView'
import type { ValidationObject } from '@/shared/validators/validator'
import {
  createReferenceFieldsValidatorWithLabels,
  createReferenceValidatorWithLabels,
  ReferenceDisplayLabelMap,
  ReferenceFieldDisplayNames,
} from '@/shared/validators/reference'
import { useNotify } from '@/hooks/notification'
import { formatReferenceValidationErrorMessage } from '@/components/Reference/referenceValidationErrors'

const NewReferenceDialogContent = ({
  onClose,
  onCreated,
  validateReferenceFields,
  referenceFieldDisplayLabelMap,
  referenceTypes,
}: {
  onClose: () => void
  onCreated: (reference: ReferenceDetailsType) => void
  validateReferenceFields: (editData: EditDataType<ReferenceDetailsType>) => ValidationObject[]
  referenceFieldDisplayLabelMap?: ReferenceDisplayLabelMap
  referenceTypes?: ReferenceType[]
}) => {
  const { editData, setFieldsWithErrors } = useDetailContext<ReferenceDetailsType>()
  const [editReferenceRequest, { isLoading }] = useEditReferenceMutation()
  const { notify } = useNotify()

  const validateAllFields = () => {
    const nextFieldsWithErrors: FieldsWithErrorsType = {}

    for (const errorObject of validateReferenceFields(editData)) {
      nextFieldsWithErrors[String(errorObject.field ?? errorObject.name)] = errorObject
    }

    setFieldsWithErrors(() => nextFieldsWithErrors)
    return Object.keys(nextFieldsWithErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateAllFields()) {
      notify('Please fix reference validation errors before saving.', 'error')
      return
    }

    try {
      const savedReference = await editReferenceRequest(editData).unwrap()
      const refType = referenceTypes?.find(referenceType => referenceType.ref_type_id === editData.ref_type_id)
      const createdReference = {
        ...editData,
        rid: savedReference.rid,
        ref_authors: editData.ref_authors ?? [],
        ref_journal: editData.ref_journal ?? null,
        ref_ref_type: { ref_type: refType?.ref_type ?? '' },
      } as ReferenceDetailsType
      notify('Saved reference successfully.')
      onCreated(createdReference)
      onClose()
    } catch (e) {
      const message = formatReferenceValidationErrorMessage(e, editData.ref_type_id, referenceFieldDisplayLabelMap)
      notify(message, 'error')
    }
  }

  return (
    <>
      <DialogContent dividers>
        <ReferenceTab />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isLoading} onClick={() => void handleSave()} startIcon={<SaveIcon />} variant="contained">
          Save reference
        </Button>
      </DialogActions>
    </>
  )
}

const NewReferenceDialog = ({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (reference: ReferenceDetailsType) => void
}) => {
  const [fieldsWithErrors, setFieldsWithErrors] = useState<FieldsWithErrorsType>({})
  const { data: referenceTypes } = useGetReferenceTypesQuery()

  const referenceFieldDisplayLabelMap = useMemo(() => {
    if (!referenceTypes) return undefined

    return referenceTypes.reduce((acc, referenceType) => {
      const labelsForType = referenceType.ref_field_name.reduce<ReferenceFieldDisplayNames>((typeLabels, field) => {
        if (field.field_name && field.ref_field_name) {
          typeLabels[field.field_name as keyof ReferenceFieldDisplayNames] = field.ref_field_name
        }

        return typeLabels
      }, {})

      return { ...acc, [referenceType.ref_type_id]: labelsForType }
    }, {} as ReferenceDisplayLabelMap)
  }, [referenceTypes])

  const referenceValidator = useMemo(
    () => createReferenceValidatorWithLabels(referenceFieldDisplayLabelMap),
    [referenceFieldDisplayLabelMap]
  )
  const validateReferenceFields = useMemo(
    () => createReferenceFieldsValidatorWithLabels(referenceFieldDisplayLabelMap),
    [referenceFieldDisplayLabelMap]
  )

  const textField = (field: keyof EditDataType<ReferenceDetailsType>, options?: TextFieldOptions) => (
    <EditableTextField<ReferenceDetailsType> field={field} {...options} />
  )

  const dropdown = (
    field: keyof EditDataType<ReferenceDetailsType>,
    options: Array<DropdownOption | string>,
    name: string,
    disabled?: boolean
  ) => <DropdownSelector<ReferenceDetailsType> field={field} options={options} name={name} disabled={disabled} />

  const dropdownWithSearch = (
    field: keyof EditDataType<ReferenceDetailsType>,
    options: Array<DropdownOption | string>,
    name: string,
    disabled?: boolean,
    label?: string
  ) => (
    <DropdownSelectorWithSearch<ReferenceDetailsType>
      field={field}
      options={options}
      name={name}
      disabled={disabled}
      label={label}
    />
  )

  const radioSelection = (
    field: keyof EditDataType<ReferenceDetailsType>,
    options: Array<DropdownOption | string>,
    name: string,
    optionalRadioSelectionProps?: OptionalRadioSelectionProps
  ) => (
    <RadioSelector<ReferenceDetailsType> field={field} options={options} name={name} {...optionalRadioSelectionProps} />
  )

  const bigTextField = (field: keyof EditDataType<ReferenceDetailsType>) => (
    <EditableTextField<ReferenceDetailsType> field={field} type="text" big />
  )

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Add new reference</DialogTitle>
      {open && (
        <DetailContextProvider<ReferenceDetailsType>
          contextState={{
            data: emptyReference,
            mode: modeOptionToMode.new,
            setMode: () => undefined,
            editData: emptyReference,
            textField,
            dropdown,
            dropdownWithSearch,
            radioSelection,
            bigTextField,
            validator: referenceValidator,
            validateFields: validateReferenceFields,
            fieldsWithErrors,
            setFieldsWithErrors,
          }}
        >
          <NewReferenceDialogContent
            onClose={onClose}
            onCreated={onCreated}
            validateReferenceFields={validateReferenceFields}
            referenceFieldDisplayLabelMap={referenceFieldDisplayLabelMap}
            referenceTypes={referenceTypes}
          />
        </DetailContextProvider>
      )}
    </Dialog>
  )
}

export const StagingView = <T extends MRT_RowData>() => {
  const { bigTextField, editData, setEditData } = useDetailContext<T>()
  const [newReferenceDialogOpen, setNewReferenceDialogOpen] = useState(false)
  const { data, isError } = useGetAllReferencesQuery(undefined, { refetchOnFocus: true })

  const editInfoArray = [
    ['Date', new Date().toLocaleDateString('en-CA')],
    ['Editor', 'Users Name'],
    ['Coordinator', 'Indre Zliobaite'],
    ['Comment', bigTextField('comment')],
  ]

  const handleReferenceCreated = (reference: ReferenceDetailsType) => {
    const selectedReferences = (editData.references ?? []) as Editable<Reference>[]
    if (selectedReferences.some(selectedReference => selectedReference.rid === reference.rid)) return

    const stagedReference = {
      ...(reference as unknown as Reference),
      ref_authors: reference.ref_authors ?? [],
      ref_journal: reference.ref_journal ?? null,
      rowState: 'new',
    }

    setEditData({
      ...editData,
      references: [...selectedReferences, stagedReference],
    })
  }

  return (
    <>
      <ArrayFrame array={editInfoArray} title="Reference for the new data" />
      <Grouped title="Reference">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'flex-start' }}>
          <SelectingTable<Reference, T>
            buttonText="Add existing reference"
            data={data}
            title="References"
            isError={isError}
            columns={referenceTableColumns}
            idFieldName="rid"
            fieldName="references"
          />
          <Button
            onClick={() => setNewReferenceDialogOpen(true)}
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ marginBottom: '1em' }}
          >
            Add new reference
          </Button>
        </Stack>
        <EditableTable<Editable<Reference>, T> columns={referenceTableColumns} field="references" />
      </Grouped>
      <NewReferenceDialog
        open={newReferenceDialogOpen}
        onClose={() => setNewReferenceDialogOpen(false)}
        onCreated={handleReferenceCreated}
      />
    </>
  )
}
