export const calculateLocalityMaxAge = (upperBound: number, lowerBound: number, frac: string | null) => {
  if (frac === null) {
    return lowerBound
  }
  const parts = frac.split(':')

  const numerator = parseInt(parts[0])
  const denominator = parseInt(parts[1])

  return upperBound + (lowerBound - upperBound) * numerator / denominator
}

export const calculateLocalityMinAge = (upperBound: number, lowerBound: number, frac: string | null) => {
  if (frac === null) {
    return upperBound
  }
  const parts = frac.split(':')

  const numerator = parseInt(parts[0])
  const denominator = parseInt(parts[1])

  return lowerBound - (lowerBound - upperBound) * (numerator - 1) / denominator
}