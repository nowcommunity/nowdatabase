import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import {
  clearTableMetadata,
  selectTableMetadata,
  TablePaginationMetadata,
  upsertTableMetadata,
} from '@/redux/slices/tablesSlice'

type ArrayWithFullCount<T> = Array<T & { full_count?: number }>

type PaginatedEnvelope<T> = {
  data?: T[]
  rows?: T[]
  totalItems?: number
  total?: number
  full_count?: number
  page?: number
  pageIndex?: number
  pageSize?: number
  limit?: number
  offset?: number
}

type SelectorFn<TInput, TOutput> = (item: TInput) => TOutput

type UsePaginatedQueryOptions<TQueryArg, TRaw, TMapped> = {
  tableId: string
  queryArg: TQueryArg
  selectorFn?: SelectorFn<TRaw, TMapped>
  enabled?: boolean
  manualPageIndex?: number
  manualPageSize?: number
}

type UnknownQueryResult<T, TError = unknown> = {
  data?: T
  isFetching?: boolean
  isLoading?: boolean
  isError?: boolean
  error?: TError
  refetch?: () => unknown
}

type QueryHook<TQueryArg, TResult> = (arg: TQueryArg) => TResult

const isObject = (candidate: unknown): candidate is Record<string, unknown> => {
  return typeof candidate === 'object' && candidate !== null
}

const derivePageSize = <TQueryArg>(
  queryArg: TQueryArg,
  envelope: PaginatedEnvelope<unknown> | undefined,
  manualPageSize?: number
): number | undefined => {
  if (typeof manualPageSize === 'number') return manualPageSize
  if (isObject(queryArg) && 'limit' in queryArg) {
    const limit = Number((queryArg as Record<string, unknown>).limit)
    if (!Number.isNaN(limit)) return limit
  }
  if (typeof envelope?.pageSize === 'number') return envelope.pageSize
  if (typeof envelope?.limit === 'number') return envelope.limit
  return undefined
}

const deriveOffset = <TQueryArg>(
  queryArg: TQueryArg,
  envelope: PaginatedEnvelope<unknown> | undefined
): number | undefined => {
  if (isObject(queryArg) && 'offset' in queryArg) {
    const offset = Number((queryArg as Record<string, unknown>).offset)
    if (!Number.isNaN(offset)) return offset
  }
  if (typeof envelope?.offset === 'number') return envelope.offset
  return undefined
}

const computeMetadata = <TQueryArg, TItem>(
  queryArg: TQueryArg,
  envelope: PaginatedEnvelope<TItem> | undefined,
  rows: TItem[] | undefined,
  manualPageIndex?: number,
  manualPageSize?: number
): TablePaginationMetadata | null => {
  if (!rows) return null

  const totalItems = (() => {
    if (typeof envelope?.full_count === 'number') return envelope.full_count
    if (typeof envelope?.totalItems === 'number') return envelope.totalItems
    if (typeof envelope?.total === 'number') return envelope.total
    const firstRow = rows[0] as { full_count?: number } | undefined
    if (firstRow && typeof firstRow.full_count === 'number') return firstRow.full_count
    return rows.length
  })()

  const pageSize = derivePageSize(queryArg, envelope, manualPageSize) ?? rows.length
  const offset = deriveOffset(queryArg, envelope) ?? 0
  const pageIndex =
    typeof manualPageIndex === 'number' ? manualPageIndex : pageSize > 0 ? Math.floor(offset / pageSize) : 0
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : totalItems > 0 ? 1 : 0

  return {
    totalItems,
    totalPages,
    pageIndex,
    pageSize,
  }
}

const ensureFullCountOnRows = <TItem>(
  rows: TItem[] | undefined,
  fullCount: number | undefined
): TItem[] | undefined => {
  if (!rows || typeof fullCount !== 'number') return rows

  if (rows.length === 0) return rows
  const firstRow = rows[0]

  // Early return if full_count already exists to avoid unnecessary array recreation
  if (!isObject(firstRow)) return rows
  if ('full_count' in firstRow) return rows

  return [{ ...(firstRow as Record<string, unknown>), full_count: fullCount } as TItem, ...rows.slice(1)]
}

export const usePaginatedQuery = <
  TQueryArg,
  TRaw,
  TMapped = TRaw,
  TError = unknown,
  TResult extends UnknownQueryResult<ArrayWithFullCount<TRaw> | PaginatedEnvelope<TRaw>, TError> = UnknownQueryResult<
    ArrayWithFullCount<TRaw> | PaginatedEnvelope<TRaw>,
    TError
  >,
>(
  queryHook: QueryHook<TQueryArg, TResult>,
  options: UsePaginatedQueryOptions<TQueryArg, TRaw, TMapped>
) => {
  const { tableId, queryArg, selectorFn, enabled = true, manualPageIndex, manualPageSize } = options

  const queryResult = queryHook(queryArg)
  const envelope = useMemo<PaginatedEnvelope<TRaw> | undefined>(() => {
    const rawData = queryResult.data
    if (!rawData) return undefined

    // Handle array responses
    if (Array.isArray(rawData)) {
      return { data: rawData }
    }

    // Handle object responses - validate basic structure
    if (isObject(rawData)) {
      // Check if the envelope has a recognizable pagination structure
      const hasData = 'data' in rawData || 'rows' in rawData
      const hasPaginationFields =
        'totalItems' in rawData ||
        'total' in rawData ||
        'full_count' in rawData ||
        'pageSize' in rawData ||
        'limit' in rawData

      // Accept envelope if it has data arrays or pagination fields
      if (hasData || hasPaginationFields) {
        return rawData
      }
    }

    return undefined
  }, [queryResult.data])

  const rows = useMemo<TRaw[] | undefined>(() => {
    if (!envelope) return undefined

    // Validate that data/rows are actually arrays
    if ('data' in envelope && Array.isArray(envelope.data)) return envelope.data
    if ('rows' in envelope && Array.isArray(envelope.rows)) return envelope.rows

    return undefined
  }, [envelope])

  const fullCount = useMemo(() => {
    if (!rows || rows.length === 0) return undefined
    const firstRow = rows[0] as { full_count?: number }
    if (typeof firstRow?.full_count === 'number') return firstRow.full_count
    if (typeof envelope?.full_count === 'number') return envelope.full_count
    if (typeof envelope?.totalItems === 'number') return envelope.totalItems
    if (typeof envelope?.total === 'number') return envelope.total
    return undefined
  }, [rows, envelope])

  const transformedRows = useMemo(() => {
    if (!rows) return rows as unknown as TMapped[] | undefined
    if (!selectorFn) return rows as unknown as TMapped[]

    return rows.map((item, index) => {
      const mapped = selectorFn(item)
      if (index === 0 && typeof fullCount === 'number' && isObject(mapped) && !('full_count' in mapped)) {
        return { ...mapped, full_count: fullCount } as TMapped
      }
      return mapped
    })
  }, [rows, selectorFn, fullCount])

  const dispatch = useDispatch()
  const cachedMetadata = useSelector((state: RootState) => selectTableMetadata(state, tableId))

  const metadata = useMemo(() => {
    const computed = computeMetadata(queryArg, envelope, rows, manualPageIndex, manualPageSize)
    if (!computed) {
      return cachedMetadata ?? null
    }

    if (
      cachedMetadata &&
      cachedMetadata.totalItems === computed.totalItems &&
      cachedMetadata.totalPages === computed.totalPages &&
      cachedMetadata.pageIndex === computed.pageIndex &&
      cachedMetadata.pageSize === computed.pageSize
    ) {
      return cachedMetadata
    }

    return computed
  }, [cachedMetadata, envelope, manualPageIndex, manualPageSize, queryArg, rows])

  useEffect(() => {
    if (!enabled) return
    if (!metadata) {
      dispatch(clearTableMetadata({ tableId }))
      return
    }
    dispatch(upsertTableMetadata({ tableId, metadata }))
  }, [dispatch, tableId, enabled, metadata])

  const decoratedRows = useMemo(
    () => ensureFullCountOnRows(transformedRows, metadata?.totalItems),
    [transformedRows, metadata?.totalItems]
  )

  const combinedIsError = Boolean(queryResult.isError) || Boolean(queryResult.error)

  return {
    ...queryResult,
    isError: combinedIsError,
    data: decoratedRows,
    pagination: metadata,
  }
}
