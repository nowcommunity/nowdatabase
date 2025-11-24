import { nowDb } from '../utils/db'

type SequenceQueryOptions = {
  limit?: number
  offset?: number
}

const sanitizeLimit = (limit: number | undefined) => {
  if (typeof limit !== 'number') return undefined
  if (Number.isNaN(limit) || limit <= 0) return undefined
  return limit
}

const sanitizeOffset = (offset: number | undefined) => {
  if (typeof offset !== 'number') return 0
  if (Number.isNaN(offset) || offset < 0) return 0
  return offset
}

export const getAllSequences = async ({ limit, offset }: SequenceQueryOptions = {}) => {
  const sanitizedLimit = sanitizeLimit(limit)
  const sanitizedOffset = sanitizeOffset(offset)

  const [sequences, totalItems] = await Promise.all([
    nowDb.now_tu_sequence.findMany({
      skip: sanitizedOffset,
      take: sanitizedLimit,
      orderBy: {
        sequence: 'asc',
      },
    }),
    nowDb.now_tu_sequence.count(),
  ])

  const rows = sequences.map(sequence => ({
    ...sequence,
    display_value: sequence.seq_name,
  }))

  return {
    rows,
    full_count: totalItems,
    limit: sanitizedLimit,
    offset: sanitizedOffset,
  }
}
