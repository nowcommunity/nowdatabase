import { ReferenceDetailsType } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useGetReferenceTypesQuery } from '@/redux/referenceReducer'
import { CircularProgress } from '@mui/material'

export const ReferenceTab = () => {
  const { dropdown, data, editData, mode, textField } = useDetailContext<ReferenceDetailsType>()
  const { data: referenceTypes } = useGetReferenceTypesQuery()

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

  const fieldsArray = fields?.map(field => [
    field.ref_field_name,
    textField(field.field_name! as keyof ReferenceDetailsType),
  ]) ?? [['Encountered error. Field type could not be found. Please contact project administrators.']]

  return (
    <>
      <ArrayFrame array={refTypeSelection} title="Reference type" />
      <ArrayFrame array={fieldsArray} title={`${selectedRefType!.ref_type} information`} />
    </>
  )
}
