import { useNavigate, useParams } from 'react-router-dom'
import { useEditRegionMutation, useGetRegionDetailsQuery } from '../../redux/regionReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { CoordinatorTab } from './Tabs/CoordinatorTab'
import { EditDataType, RegionDetails as RegionDetailsType, ValidationErrors } from '@/shared/types'
import { useNotify } from '@/hooks/notification'
import { validateRegion } from '@/shared/validators/region'
import { emptyRegion } from '../DetailView/common/defaultValues'

export const RegionDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  const { isLoading, isError, data } = useGetRegionDetailsQuery(id!, { skip: isNew })
  const [editRegionRequest, { isLoading: mutationLoading }] = useEditRegionMutation()
  const notify = useNotify()
  const navigate = useNavigate()

  if (isError) return <div>Error loading data</div>
  if (isLoading || (!data && !isNew) || mutationLoading) return <CircularProgress />

  document.title = isNew ? 'New region' : data!.region

  const onWrite = async (editData: EditDataType<RegionDetailsType>) => {
    try {
      const { reg_coord_id } = await editRegionRequest(editData).unwrap()
      notify('Saved region successfully.')
      setTimeout(() => navigate(`/region/${reg_coord_id}`), 15)
    } catch (e) {
      const error = e as ValidationErrors
      notify('Following validators failed: ' + error.data.map(e => e.name).join(', '), 'error')
    }
  }

  const tabs: TabType[] = [
    {
      title: 'Regional',
      content: <CoordinatorTab />,
    },
  ]

  return (
    <DetailView
      tabs={tabs}
      isNew={isNew}
      data={isNew ? emptyRegion : data!}
      onWrite={onWrite}
      validator={validateRegion}
    />
  )
}
