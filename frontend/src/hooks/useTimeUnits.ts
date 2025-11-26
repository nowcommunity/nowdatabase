import { useMemo } from 'react'
import { useGetAllTimeUnitsQuery } from '@/redux/timeUnitReducer'
import { TimeUnit } from '@/shared/types'

const normalizeTimeUnitName = (name: string | null | undefined) =>
  (name ?? '')
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, '')

const hasMatchingTimeUnit = (
  timeUnits: TimeUnit[] | undefined,
  normalizedInputName: string,
  normalizedCurrentId: string
) => {
  if (!timeUnits || !normalizedInputName) return false

  return timeUnits.some(timeUnit => {
    const normalizedDisplayName = normalizeTimeUnitName(timeUnit.tu_display_name)
    const normalizedId = normalizeTimeUnitName(timeUnit.tu_name)

    if (normalizedCurrentId && normalizedId === normalizedCurrentId) return false

    return normalizedInputName === normalizedDisplayName || normalizedInputName === normalizedId
  })
}

export const useTimeUnitNameAvailability = (displayName: string | null | undefined, currentId?: string | null) => {
  const { data: allTimeUnits, isLoading, isFetching } = useGetAllTimeUnitsQuery()

  const normalizedInputName = useMemo(() => normalizeTimeUnitName(displayName), [displayName])
  const normalizedCurrentId = useMemo(() => normalizeTimeUnitName(currentId), [currentId])

  const hasDuplicateName = useMemo(
    () => hasMatchingTimeUnit(allTimeUnits, normalizedInputName, normalizedCurrentId),
    [allTimeUnits, normalizedCurrentId, normalizedInputName]
  )

  return {
    hasDuplicateName,
    normalizedInputName,
    isCheckingName: isLoading || isFetching,
  }
}
