const cloneValue = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const cloneDeep = cloneValue

export const isEqualWith = (
  value: unknown,
  other: unknown,
  customizer?: (value: unknown, other: unknown) => boolean | undefined
): boolean => {
  const customizedResult = customizer?.(value, other)
  if (customizedResult !== undefined) return customizedResult

  if (Object.is(value, other)) return true

  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) return false
    return value.every((item, index) => isEqualWith(item, other[index], customizer))
  }

  if (isPlainObject(value) && isPlainObject(other)) {
    const valueKeys = Object.keys(value)
    const otherKeys = Object.keys(other)

    if (valueKeys.length !== otherKeys.length) return false

    return valueKeys.every(key => isEqualWith(value[key], other[key], customizer))
  }

  return false
}
