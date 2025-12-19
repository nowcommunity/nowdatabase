import { useParams, useNavigate } from 'react-router-dom'
import { CircularProgress } from '@mui/material'
import { DetailView, TabType } from '../DetailView/DetailView'
import { ReferenceTab } from './Tabs/ReferenceTab'
import { LocalityTab } from './Tabs/LocalityTab'
import { SpeciesTab } from './Tabs/SpeciesTab'
import {
  useEditReferenceMutation,
  useGetReferenceDetailsQuery,
  useDeleteReferenceMutation,
  useGetReferenceTypesQuery,
} from '@/redux/referenceReducer'
import { EditDataType, ReferenceDetailsType, ValidationErrors } from '@/shared/types'
import { emptyReference } from '../DetailView/common/defaultValues'
import {
  createReferenceValidatorWithLabels,
  ReferenceFieldDisplayNames,
  ReferenceDisplayLabelMap,
} from '@/shared/validators/reference'
import { useNotify } from '@/hooks/notification'
import { useEffect, useMemo } from 'react'
import { createReferenceTitle } from './referenceFormatting'
import { useReturnNavigation } from '@/hooks/useReturnNavigation'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

const REFERENCE_DELETE_CONFLICT_MESSAGE = 'The Reference with associated updates cannot be deleted.'
const GENERIC_DELETE_MESSAGE = 'Could not delete item. Error happened.'

const resolveDeleteErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
  if (error && 'status' in error) {
    const errorData = (error.data ?? {}) as { message?: string }

    if (typeof errorData.message === 'string' && errorData.message.trim().length > 0) {
      return errorData.message
    }

    if (error.status === 409) {
      return REFERENCE_DELETE_CONFLICT_MESSAGE
    }
  }

  return GENERIC_DELETE_MESSAGE
}

export const ReferenceDetails = ({
  wrapWithUnsavedChangesProvider = true,
}: {
  wrapWithUnsavedChangesProvider?: boolean
} = {}) => {
  const { id } = useParams()
  const isNew = id === 'new'
  if (isNew) {
    document.title = 'New reference'
  }
  const { isFetching, isError, data } = useGetReferenceDetailsQuery(id!, { skip: isNew })
  const [editReferenceRequest, { isLoading: mutationLoading }] = useEditReferenceMutation()
  const [deleteMutation, { isSuccess: deleteSuccess }] = useDeleteReferenceMutation()
  const { notify } = useNotify()
  const navigate = useNavigate()
  const { fallbackTarget } = useReturnNavigation({ fallback: '/reference' })
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

  useEffect(() => {
    if (deleteSuccess) {
      notify('Deleted item successfully.')
      navigate(fallbackTarget)
    }
  }, [deleteSuccess, notify, navigate, fallbackTarget])

  if (isError) return <div>Error loading data</div>
  if (isFetching || (!data && !isNew) || mutationLoading) return <CircularProgress />
  if (data) {
    document.title = `Reference - ${createReferenceTitle(data)}`
  }

  const onWrite = async (editData: EditDataType<ReferenceDetailsType>) => {
    try {
      const { rid } = await editReferenceRequest(editData).unwrap()
      notify('Saved reference successfully.')
      setTimeout(() => navigate(`/reference/${rid}`), 15)
    } catch (e) {
      const error = e as ValidationErrors
      notify('Following validators failed: ' + error.data.map(e => e.name).join(', '), 'error')
    }
  }

  const deleteFunction = async () => {
    try {
      await deleteMutation(parseInt(id!)).unwrap()
    } catch (error) {
      const message = resolveDeleteErrorMessage(error as FetchBaseQueryError | SerializedError | undefined)
      notify(message, 'error')
    }
  }

  const tabs: TabType[] = [
    {
      title: 'Reference',
      content: <ReferenceTab />,
    },
    {
      title: 'Localities',
      content: <LocalityTab />,
    },
    {
      title: 'Species',
      content: <SpeciesTab />,
    },
  ]

  return (
    <DetailView
      tabs={tabs}
      isNew={isNew}
      data={isNew ? emptyReference : data!}
      onWrite={onWrite}
      validator={referenceValidator}
      deleteFunction={deleteFunction}
      wrapWithUnsavedChangesProvider={wrapWithUnsavedChangesProvider}
    />
  )
}
