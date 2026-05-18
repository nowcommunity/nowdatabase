import { createWriteStream } from 'fs'
import { once } from 'events'

export const normalizeDwcCsvValue = (value: string): string => value.replace(/\r\n|\r|\n/g, ' ').replace(/[ \t]+/g, ' ')

export const toDwcCsvString = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'bigint') return value.toString()
  if (typeof value === 'number') return Number.isFinite(value) ? value.toString() : ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'string') return normalizeDwcCsvValue(value)
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object') {
    if (typeof (value as { toString?: unknown }).toString === 'function') {
      const asString = (value as { toString: () => string }).toString()
      if (asString && asString !== '[object Object]') return normalizeDwcCsvValue(asString)
    }
    try {
      return normalizeDwcCsvValue(JSON.stringify(value) ?? '')
    } catch {
      return ''
    }
  }
  return ''
}

export const dwcCsvCell = (value: unknown): string => `"${toDwcCsvString(value).replace(/"/g, '""')}"`

export const dwcCsvLine = (headers: readonly string[], row: Record<string, unknown>): string =>
  `${headers.map(header => dwcCsvCell(row[header])).join(',')}\n`

export const writeDwcCsvString = (headers: readonly string[], rows: Array<Record<string, unknown>>): string => {
  const lines = [`${headers.map(dwcCsvCell).join(',')}\n`]
  for (const row of rows) {
    lines.push(dwcCsvLine(headers, row))
  }
  return lines.join('')
}

export const createDwcCsvFileWriter = async (filePath: string, headers: readonly string[]) => {
  const stream = createWriteStream(filePath, { encoding: 'utf8' })
  await new Promise<void>((resolve, reject) => {
    stream.once('open', () => resolve())
    stream.once('error', reject)
  })

  const write = async (line: string): Promise<void> => {
    if (!stream.write(line)) await once(stream, 'drain')
  }

  await write(`${headers.map(dwcCsvCell).join(',')}\n`)

  return {
    writeRow: async (row: Record<string, unknown>): Promise<void> => {
      await write(dwcCsvLine(headers, row))
    },
    close: async (): Promise<void> => {
      stream.end()
      await once(stream, 'finish')
    },
  }
}
