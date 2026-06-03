import HistoryIcon from '@mui/icons-material/History'
import { Box, Card, Divider, IconButton, Popover, Tooltip, Typography } from '@mui/material'
import { useContext, useMemo, useState, type Context, type MouseEvent } from 'react'
import { DetailContext, type DetailContextType } from '@/components/DetailView/Context/DetailContext'
import type { AnyReference, UpdateLog } from '@/shared/types'
import { ReferenceList } from './ReferenceList'

type UpdateContainer = Record<string, unknown> & {
  updates: UpdateLog[]
}

type FieldUpdate = {
  log: UpdateLog
  container: UpdateContainer
}

type EntryUpdateHistoryProps<TRow> = {
  row: TRow
  label: string
  tableName: string
  columnName?: string
  getRowValue: (row: TRow) => unknown
  getPkValues?: (row: TRow) => unknown[]
}

const SafeDetailContext = DetailContext as unknown as Context<DetailContextType<Record<string, unknown>> | null>

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isUpdateLog = (value: unknown): value is UpdateLog =>
  isObject(value) && 'column_name' in value && 'log_action' in value

const getPkData = (log: UpdateLog & { pk_data?: unknown }) => log.pk_data

const isUpdateContainer = (value: unknown): value is UpdateContainer =>
  isObject(value) && Array.isArray(value.updates) && value.updates.every(isUpdateLog)

const collectUpdateContainers = (value: unknown, seen = new Set<unknown>()): UpdateContainer[] => {
  if (!isObject(value) && !Array.isArray(value)) return []
  if (seen.has(value)) return []
  seen.add(value)

  const containers: UpdateContainer[] = []
  if (isUpdateContainer(value)) containers.push(value)

  const nestedValues = Array.isArray(value) ? value : Object.values(value)
  nestedValues.forEach(nestedValue => {
    containers.push(...collectUpdateContainers(nestedValue, seen))
  })

  return containers
}

const getFieldUpdates = (data: unknown, field: string): FieldUpdate[] =>
  collectUpdateContainers(data).flatMap(container =>
    container.updates
      .filter(log => log.column_name === field)
      .map(log => ({
        log,
        container,
      }))
  )

const stringifyComparableValue = (value: unknown): string | undefined => {
  if (value === null || value === undefined || value === '') return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value)
  if (value instanceof Date) return value.toISOString()
  return undefined
}

const getEncodedPkSegment = (value: unknown) => {
  const text = stringifyComparableValue(value)
  if (!text) return undefined
  return `${text.length}.${text};`
}

const isString = (value: unknown): value is string => typeof value === 'string'

const getEncodedPkSegments = (values: unknown[]) => values.map(getEncodedPkSegment).filter(isString)

const toSafeDomIdPart = (value: unknown): string => {
  const text = stringifyComparableValue(value) ?? formatValue(value)
  const sanitized = text.trim().replace(/[^A-Za-z0-9_-]+/g, '-')
  return sanitized.replace(/^-+|-+$/g, '') || 'entry'
}

const valuesMatch = (left: unknown, right: unknown) => {
  const leftText = stringifyComparableValue(left)
  const rightText = stringifyComparableValue(right)
  return Boolean(leftText && rightText && leftText === rightText)
}

const getEntryUpdates = (
  data: unknown,
  tableName: string,
  columnName: string | undefined,
  rowValue: unknown,
  pkValues: unknown[]
): FieldUpdate[] => {
  const encodedPkSegments = getEncodedPkSegments(pkValues)
  const fallbackPkSegment = getEncodedPkSegment(rowValue)

  return collectUpdateContainers(data).flatMap(container =>
    container.updates
      .filter(log => {
        if (log.table_name !== tableName) return false

        const pkData = getPkData(log)
        const pkDataMatches =
          typeof pkData === 'string' && encodedPkSegments.length > 0
            ? encodedPkSegments.every(segment => pkData.includes(segment))
            : false
        if (pkDataMatches) return true
        if (typeof pkData === 'string' && encodedPkSegments.length > 0) return false

        const fallbackPkDataMatches =
          typeof pkData === 'string' && encodedPkSegments.length === 0 && fallbackPkSegment
            ? pkData.includes(fallbackPkSegment)
            : false
        if (fallbackPkDataMatches) return true

        if (columnName && log.column_name !== columnName) return false

        return valuesMatch(log.new_data, rowValue) || valuesMatch(log.old_data, rowValue)
      })
      .map(log => ({
        log,
        container,
      }))
  )
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value instanceof Date) return value.toISOString()
  return JSON.stringify(value)
}

const formatDate = (value: unknown): string => {
  if (!value) return 'No date'
  const date = new Date(value as string | number | Date)
  if (Number.isNaN(date.getTime())) return formatValue(value)
  return date.toISOString().split('T')[0]
}

const findFirstBySuffix = (container: UpdateContainer, suffix: string): unknown => {
  const entry = Object.entries(container).find(([key]) => key.endsWith(suffix))
  return entry?.[1]
}

const getDate = (container: UpdateContainer) => container.date ?? findFirstBySuffix(container, '_date')
const getEditor = (container: UpdateContainer) => container.authorizer ?? findFirstBySuffix(container, '_authorizer')
const getCoordinator = (container: UpdateContainer) =>
  container.coordinator ?? findFirstBySuffix(container, '_coordinator')
const getComment = (container: UpdateContainer) => container.comment ?? findFirstBySuffix(container, '_comment')

const isAnyReference = (value: unknown): value is AnyReference =>
  isObject(value) && typeof value.rid === 'number' && isObject(value.ref_ref)

const collectReferences = (value: unknown, seen = new Set<unknown>()): AnyReference[] => {
  if (!isObject(value) && !Array.isArray(value)) return []
  if (seen.has(value)) return []
  seen.add(value)

  if (Array.isArray(value)) {
    if (value.every(isAnyReference)) return value
    return value.flatMap(item => collectReferences(item, seen))
  }

  return Object.entries(value)
    .filter(([key]) => key !== 'updates')
    .flatMap(([, nestedValue]) => collectReferences(nestedValue, seen))
}

const formatAction = (action: number | null | undefined) => {
  if (action === 1) return 'Delete'
  if (action === 3) return 'Update'
  return 'Add'
}

const UpdateHistoryPopover = ({
  idPrefix,
  title,
  tooltip,
  ariaLabel,
  updates,
  onOpen,
}: {
  idPrefix: string
  title: string
  tooltip: string
  ariaLabel: string
  updates: FieldUpdate[]
  onOpen?: (event: MouseEvent<HTMLElement>) => void
}) => {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)

  const open = Boolean(anchorElement)
  const id = open ? `${idPrefix}-update-history-popover` : undefined

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    onOpen?.(event)
    setAnchorElement(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorElement(null)
  }

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton
          aria-label={ariaLabel}
          aria-describedby={id}
          size="small"
          onClick={handleOpen}
          sx={{ ml: 0.5, p: 0.25, color: 'text.secondary', flexShrink: 0 }}
        >
          <HistoryIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorElement}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box p={2} maxWidth={560} display="flex" flexDirection="column" gap={1.5}>
          <Typography variant="subtitle1" component="h2">
            {title}
          </Typography>
          {updates.map(({ log, container }, index) => {
            const references = collectReferences(container)
            return (
              <Card key={`${index}-${log.log_id ?? ''}-${log.column_name ?? idPrefix}`} sx={{ p: 1.5 }}>
                <Typography variant="body2">
                  <b>Date:</b> {formatDate(getDate(container))}
                </Typography>
                <Typography variant="body2">
                  <b>Editor:</b> {formatValue(getEditor(container))}
                </Typography>
                <Typography variant="body2">
                  <b>Coordinator:</b> {formatValue(getCoordinator(container))}
                </Typography>
                <Typography variant="body2">
                  <b>Action:</b> {formatAction(log.log_action)}
                </Typography>
                <Typography variant="body2">
                  <b>Table:</b> {formatValue(log.table_name)}
                </Typography>
                <Typography variant="body2">
                  <b>Before:</b> {log.old_data ?? ''}
                </Typography>
                <Typography variant="body2">
                  <b>After:</b> {log.new_data ?? ''}
                </Typography>
                {getComment(container) ? (
                  <Typography variant="body2">
                    <b>Comment:</b> {formatValue(getComment(container))}
                  </Typography>
                ) : null}
                <Divider sx={{ my: 1 }} />
                {references.length === 0 ? (
                  <Typography variant="body2">No references.</Typography>
                ) : (
                  <ReferenceList references={references} big={false} />
                )}
              </Card>
            )
          })}
        </Box>
      </Popover>
    </>
  )
}

export const FieldUpdateHistory = ({ field, label }: { field: string; label: string }) => {
  const detailContext = useContext(SafeDetailContext)
  const updates = useMemo(() => getFieldUpdates(detailContext?.data, field), [detailContext?.data, field])

  if (!detailContext?.mode.read || updates.length === 0) return null

  return (
    <UpdateHistoryPopover
      idPrefix={field}
      title={`${label} update history`}
      tooltip={`Show update history for ${label}`}
      ariaLabel={`Show update history for ${label}`}
      updates={updates}
    />
  )
}

export const EntryUpdateHistory = <TRow,>({
  row,
  label,
  tableName,
  columnName,
  getRowValue,
  getPkValues,
}: EntryUpdateHistoryProps<TRow>) => {
  const detailContext = useContext(SafeDetailContext)
  const rowValue = getRowValue(row)
  const pkValues = useMemo(() => getPkValues?.(row) ?? [rowValue], [getPkValues, row, rowValue])
  const updates = useMemo(
    () => getEntryUpdates(detailContext?.data, tableName, columnName, rowValue, pkValues),
    [columnName, detailContext?.data, pkValues, rowValue, tableName]
  )

  if (!detailContext?.mode.read || updates.length === 0) return null

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  return (
    <UpdateHistoryPopover
      idPrefix={[tableName, columnName, rowValue].filter(Boolean).map(toSafeDomIdPart).join('-')}
      title={`${label} entry history`}
      tooltip={`Show entry history for ${label}`}
      ariaLabel={`Show entry history for ${label}`}
      updates={updates}
      onOpen={handleOpen}
    />
  )
}
