export const parseNumericIds = (value: unknown): number[] | undefined => {
  if (value === undefined) return undefined
  if (!Array.isArray(value)) throw new Error('ids must be an array.')

  return value.map(id => {
    const parsed = typeof id === 'number' ? id : typeof id === 'string' && /^-?\d+$/.test(id) ? Number(id) : Number.NaN

    if (!Number.isSafeInteger(parsed)) throw new Error('ids must contain only integers.')
    return parsed
  })
}
