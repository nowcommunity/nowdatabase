import { ReferenceDetailsType } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useGetReferenceTypesQuery } from '@/redux/referenceReducer'
import { CircularProgress } from '@mui/material'

export const ReferenceTab = () => {
  const { dropdown } = useDetailContext<ReferenceDetailsType>()
  const { data: referenceTypes } = useGetReferenceTypesQuery()

  if (!referenceTypes) return <CircularProgress />

  const referenceTypeOptions = referenceTypes.map(refType => ({
    display: refType.ref_type ?? 'Unknown',
    value: refType.ref_type_id + '',
  }))
  console.log({ referenceTypeOptions })
  const refTypeSelection = [['Reference type', dropdown('ref_type_id', referenceTypeOptions, 'Reference type')]]

  return (
    <>
      <ArrayFrame array={refTypeSelection} title="Reference type" />
    </>
  )
}
