export const decimalCount = (num: number): number => {
  const numAsString = num.toString()
  if (numAsString.includes('.')) {
    return numAsString.split('.')[1].length
  }

  return 0
}

export const formatWithMaxThreeDecimals = (value: unknown): number | string => {
  const numericValue = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN
  if (!Number.isFinite(numericValue)) {
    return ''
  }

  if (decimalCount(numericValue) > 3) {
    return numericValue.toFixed(3)
  }

  return numericValue
}
