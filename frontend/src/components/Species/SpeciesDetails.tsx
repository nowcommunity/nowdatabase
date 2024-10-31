import { useNavigate, useParams } from 'react-router-dom'
import { useDeleteSpeciesMutation, useEditSpeciesMutation, useGetSpeciesDetailsQuery } from '../../redux/speciesReducer'
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
import { EditDataType, SpeciesDetailsType, ValidationErrors } from '@/backendTypes'
import { validateSpecies } from '@/validators/species'
import { emptySpecies } from '../DetailView/common/defaultValues'
import { useNotify } from '@/hooks/notification'
import { useEffect } from 'react'

export const SpeciesDetails = () => {
  const { id } = useParams()
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New species'
  }
  const [editSpeciesRequest, { isLoading: mutationLoading }] = useEditSpeciesMutation()
  const { isError, isFetching, data } = useGetSpeciesDetailsQuery(id!, { skip: isNew })
  const notify = useNotify()
  const navigate = useNavigate()
  const [deleteMutation, { isSuccess: deleteSuccess, isError: deleteError }] = useDeleteSpeciesMutation()

  useEffect(() => {
    if (deleteSuccess) {
      notify('Deleted item successfully.')
      navigate('/species')
    } else if (deleteError) {
      notify('Could not delete item. Error happened.', 'error')
    }
  }, [deleteSuccess, deleteError, notify, navigate])

  if (isError) return <div>Error loading data</div>
  if (isFetching || (!data && !isNew) || mutationLoading) return <CircularProgress />
  if (data) {
    document.title = `Species - ${data.species_name}`
  }

  const deleteFunction = async () => {
    await deleteMutation(parseInt(id!)).unwrap()
  }

  const onWrite = async (editData: EditDataType<SpeciesDetailsType>) => {
    try {
      const { species_id } = await editSpeciesRequest(editData).unwrap()
      notify('Saved species entry successfully.')
      setTimeout(() => navigate(`/species/${species_id}`), 15)
    } catch (e) {
      const error = e as ValidationErrors
      let message = 'Could not save item. Missing: '
      Object.keys(error.data).forEach(key => {
        message += `${error.data[key].name}. `
      })
      notify(message, 'error')
    }
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
      validator={validateSpecies}
      deleteFunction={deleteFunction}
    />
  )
}
