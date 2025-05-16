import { ReferenceDetailsType } from '@/shared/types'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useGetReferenceTypesQuery } from '@/redux/referenceReducer'
import { CircularProgress } from '@mui/material'
import { AuthorTab } from './AuthorTab'
import { JournalTab } from './JournalTab'
import { useEffect } from 'react'

export const ReferenceTab = () => {
  const { dropdown, data, editData, mode, textField, bigTextField, fieldsWithErrors, validator, setFieldsWithErrors } =
    useDetailContext<ReferenceDetailsType>()
  const { data: referenceTypes } = useGetReferenceTypesQuery()

  useEffect(() => {
    if (mode.option === 'edit' || mode.option === 'new') {
      for (const field in editData) {
        const fieldAsKey = field as keyof typeof editData
        const fieldAsString = String(fieldAsKey)
        const errorObject = validator(editData, fieldAsKey)
        if (errorObject.error) {
          if (!(fieldAsString in fieldsWithErrors)) {
            setFieldsWithErrors(prevFieldsWithErrors => {
              return { ...prevFieldsWithErrors, [fieldAsString]: errorObject }
            })
          }
        } else if (!errorObject.error && fieldAsString in fieldsWithErrors) {
          setFieldsWithErrors(prevFieldsWithErrors => {
            const newFieldsWithErrors = { ...prevFieldsWithErrors }
            delete newFieldsWithErrors[fieldAsString]
            return newFieldsWithErrors
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData.ref_type_id])

  if (!referenceTypes) return <CircularProgress />

  const referenceTypeOptions = referenceTypes
    .map(refType => ({
      display: refType.ref_type ?? 'Unknown',
      value: refType.ref_type_id,
    }))
    .sort((a, b) => a.display.localeCompare(b.display))

  const refTypeSelection = [['Reference type', dropdown('ref_type_id', referenceTypeOptions, 'Reference type')]]

  const selectedRefType = referenceTypes.find(refType => {
    if (mode.read) {
      return data.ref_type_id === refType.ref_type_id
    }
    return editData.ref_type_id === refType.ref_type_id
  })

  const fields = selectedRefType?.ref_field_name.filter(field => field.display)

  // Write here the fields that should have a bigger, resizable text field
  const bigFields = ['title_primary', 'authors_primary', 'ref_abstract', 'gen_notes']
  const authorFields = ['authors_primary', 'authors_secondary', 'authors_series']
  const numberFields = ['ref_type_id', 'date_primary', 'date_secondary', 'start_page', 'end_page']

  //painfully long way to split the arrayframe-component when an authorfield occurs
  const groupedFieldsArray = []
  let nonAuthorFieldsArray: [string | null, JSX.Element][] = []

  fields?.forEach(field => {
    if (authorFields.includes(field.field_name!)) {
      if (nonAuthorFieldsArray.length > 0) {
        groupedFieldsArray.push(
          <ArrayFrame
            key={`fields-group-${nonAuthorFieldsArray[0][0]}`}
            array={nonAuthorFieldsArray}
            title={`${selectedRefType!.ref_type} information`}
          />
        )
        nonAuthorFieldsArray = []
      }

      groupedFieldsArray.push(
        <AuthorTab key={field.field_name} field_num_param={field.field_ID} tab_name={field.ref_field_name} />
      )
    } else if (field.field_name == 'journal_id') {
      if (nonAuthorFieldsArray.length > 0) {
        groupedFieldsArray.push(
          <ArrayFrame
            key={`fields-group-${nonAuthorFieldsArray[0][0]}`}
            array={nonAuthorFieldsArray}
            title={`${selectedRefType!.ref_type} information`}
          />
        )
        nonAuthorFieldsArray = []
      }
      groupedFieldsArray.push(<JournalTab key={field.field_name} tab_name={field.ref_field_name} />)
    } else {
      const fieldComponent = bigFields.includes(field.field_name!)
        ? bigTextField(field.field_name! as keyof ReferenceDetailsType)
        : textField(field.field_name! as keyof ReferenceDetailsType)
      if (field.field_name && numberFields.includes(field.field_name)) {
        nonAuthorFieldsArray.push([
          field.ref_field_name,
          textField(field.field_name as keyof ReferenceDetailsType, { type: 'number' }),
        ])
      } else if (field.field_name == 'exact_date') {
        nonAuthorFieldsArray.push([
          field.ref_field_name,
          textField(field.field_name as keyof ReferenceDetailsType, { type: 'date' }),
        ])
      } else {
        nonAuthorFieldsArray.push([field.ref_field_name, fieldComponent])
      }
    }
  })

  if (nonAuthorFieldsArray.length > 0) {
    groupedFieldsArray.push(
      <ArrayFrame
        key={`fields-group-${nonAuthorFieldsArray[0][0]}`}
        array={nonAuthorFieldsArray}
        title={`${selectedRefType!.ref_type} information`}
      />
    )
  }

  return (
    <>
      <ArrayFrame array={refTypeSelection} title="Reference type" />
      {groupedFieldsArray}
    </>
  )
}
