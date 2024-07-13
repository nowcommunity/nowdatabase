import { useParams } from 'react-router-dom'
import { useEditSpeciesMutation, useGetSpeciesDetailsQuery } from '../../redux/speciesReducer'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { DietTab } from './Tabs/DietTab'
import { LocalityTab } from './Tabs/LocalityTab'
import { LocalitySpeciesTab } from './Tabs/LocalitySpeciesTab'
import { LocomotionTab } from './Tabs/LocomotionTab'
import { SizeTab } from './Tabs/SizeTab'
import { SynonymTab } from './Tabs/SynonymTab'
import { TaxonomyTab } from './Tabs/TaxonomyTab'
import { TeethTab } from './Tabs/TeethTab'
import { UpdateTab } from '../DetailView/common/UpdateTab'
import { EditDataType, SpeciesDetailsType } from '@/backendTypes'
import { emptySpecies } from '../DetailView/common/defaultValues'

export const SpeciesDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  const { isLoading, isError, isFetching, data } = useGetSpeciesDetailsQuery(id!, { skip: isNew })
  const [editSpeciesRequest] = useEditSpeciesMutation()
  if (isError) return <div>Error loading data</div>
  if (isLoading || isFetching || (!data && !isNew)) return <CircularProgress />

  const onWrite = async (editData: EditDataType<SpeciesDetailsType>) => {
    await editSpeciesRequest(editData)
  }

  const tabs: TabType[] = [
    {
      title: 'Taxonomy',
      content: <TaxonomyTab />,
    },
    {
      title: 'Synonyms',
      content: <SynonymTab />,
    },
    {
      title: 'Diet',
      content: <DietTab />,
    },
    {
      title: 'Locomotion',
      content: <LocomotionTab />,
    },
    {
      title: 'Size',
      content: <SizeTab />,
    },
    {
      title: 'Teeth',
      content: <TeethTab />,
    },
    {
      title: 'Localities',
      content: <LocalityTab />,
    },
    {
      title: 'Locality Species',
      content: <LocalitySpeciesTab />,
    },
    {
      title: 'Updates',
      content: <UpdateTab refFieldName="now_sr" updatesFieldName="now_sau" prefix="sau" />,
    },
  ]

  return (
    <DetailView
      tabs={tabs}
      data={isNew ? emptySpecies : data!}
      onWrite={onWrite}
      isNew={isNew}
      hasStagingMode
      validator={() => ({
        name: 'unknown',
        error: null,
      })}
    />
  )
}
