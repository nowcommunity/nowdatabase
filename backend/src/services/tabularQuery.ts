import type { Request } from 'express'

type SortInput = {
  id: string
  desc: boolean
}

export type TabListQueryOptions = {
  sorting: SortInput[]
  skip?: number
  take?: number
}

type ParseTabQuerySuccess = {
  ok: true
  options: TabListQueryOptions
}

type ParseTabQueryFailure = {
  ok: false
  errors: string[]
}

type ParseTabQueryResult = ParseTabQuerySuccess | ParseTabQueryFailure

type ParseTabQueryParams = {
  query: Request['query']
  allowedSortingColumns: string[]
  defaultSorting: SortInput[]
  allowServerColumnFilters?: boolean
}

const getSingleQueryValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }

  return undefined
}

const parseSorting = (sortingRaw: string | undefined, allowedSortingColumns: string[]) => {
  if (!sortingRaw) {
    return { sorting: undefined as SortInput[] | undefined, errors: [] as string[] }
  }

  try {
    const parsed = JSON.parse(sortingRaw) as unknown

    if (!Array.isArray(parsed)) {
      return { sorting: undefined, errors: ['sorting must be a JSON array.'] }
    }

    const normalizedSorting: SortInput[] = []
    for (const entry of parsed) {
      if (typeof entry !== 'object' || entry === null) {
        return { sorting: undefined, errors: ['sorting entries must be objects.'] }
      }

      const candidate = entry as { id?: unknown; desc?: unknown }
      if (typeof candidate.id !== 'string' || !allowedSortingColumns.includes(candidate.id)) {
        return { sorting: undefined, errors: [`sorting.id must be one of: ${allowedSortingColumns.join(', ')}.`] }
      }

      if (candidate.desc !== undefined && typeof candidate.desc !== 'boolean') {
        return { sorting: undefined, errors: ['sorting.desc must be boolean when provided.'] }
      }

      normalizedSorting.push({ id: candidate.id, desc: Boolean(candidate.desc) })
    }

    return { sorting: normalizedSorting, errors: [] as string[] }
  } catch {
    return { sorting: undefined, errors: ['sorting must be valid JSON.'] }
  }
}

const parseColumnFilters = (columnFiltersRaw: string | undefined, allowServerColumnFilters: boolean): string[] => {
  if (!columnFiltersRaw) {
    return []
  }

  try {
    const parsed = JSON.parse(columnFiltersRaw) as unknown
    if (!Array.isArray(parsed)) {
      return ['columnfilters must be a JSON array.']
    }

    if (!allowServerColumnFilters && parsed.length > 0) {
      return ['Server-side columnfilters are not supported for this endpoint. Use client-side filtering.']
    }

    return []
  } catch {
    return ['columnfilters must be valid JSON.']
  }
}

const parsePagination = (query: Request['query']): { skip?: number; take?: number; errors: string[] } => {
  const errors: string[] = []

  const limitRaw = getSingleQueryValue(query.limit)
  const offsetRaw = getSingleQueryValue(query.offset)

  const parseWholeNumber = (value: string, fieldName: 'limit' | 'offset') => {
    if (!/^\d+$/.test(value)) {
      errors.push(`${fieldName} must be a non-negative integer.`)
      return undefined
    }

    const parsed = parseInt(value, 10)
    if (fieldName === 'limit' && (parsed < 1 || parsed > 500)) {
      errors.push('limit must be between 1 and 500.')
      return undefined
    }

    return parsed
  }

  if (limitRaw || offsetRaw) {
    const take = limitRaw ? parseWholeNumber(limitRaw, 'limit') : undefined
    const skip = offsetRaw ? parseWholeNumber(offsetRaw, 'offset') : undefined
    return { take, skip, errors }
  }

  const paginationRaw = getSingleQueryValue(query.pagination)
  if (!paginationRaw) {
    return { errors }
  }

  try {
    const parsed = JSON.parse(paginationRaw) as unknown
    if (typeof parsed !== 'object' || parsed === null) {
      errors.push('pagination must be a JSON object.')
      return { errors }
    }

    const candidate = parsed as { pageIndex?: unknown; pageSize?: unknown }
    if (!Number.isInteger(candidate.pageIndex) || (candidate.pageIndex as number) < 0) {
      errors.push('pagination.pageIndex must be a non-negative integer.')
      return { errors }
    }

    if (
      !Number.isInteger(candidate.pageSize) ||
      (candidate.pageSize as number) < 1 ||
      (candidate.pageSize as number) > 500
    ) {
      errors.push('pagination.pageSize must be an integer between 1 and 500.')
      return { errors }
    }

    return {
      skip: (candidate.pageIndex as number) * (candidate.pageSize as number),
      take: candidate.pageSize as number,
      errors,
    }
  } catch {
    errors.push('pagination must be valid JSON.')
    return { errors }
  }
}

export const parseTabListQuery = ({
  query,
  allowedSortingColumns,
  defaultSorting,
  allowServerColumnFilters = false,
}: ParseTabQueryParams): ParseTabQueryResult => {
  const sortingRaw = getSingleQueryValue(query.sorting)
  const columnFiltersRaw = getSingleQueryValue(query.columnfilters) ?? getSingleQueryValue(query.columnFilters)

  const sortingResult = parseSorting(sortingRaw, allowedSortingColumns)
  const columnFilterErrors = parseColumnFilters(columnFiltersRaw, allowServerColumnFilters)
  const paginationResult = parsePagination(query)

  const errors = [...sortingResult.errors, ...columnFilterErrors, ...paginationResult.errors]
  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    options: {
      sorting: sortingResult.sorting ?? defaultSorting,
      skip: paginationResult.skip,
      take: paginationResult.take,
    },
  }
}
