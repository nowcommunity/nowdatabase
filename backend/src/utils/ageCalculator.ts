export const calculateLocalityMaxAge = (minAge: number, maxAge: number, frac: string | null) => {
  if (frac === null) {
    return maxAge
  }
  const parts = frac.split(':')

  const numerator = parseInt(parts[0])
  const denominator = parseInt(parts[1])

  return minAge + (maxAge - minAge) * numerator / denominator
}

export const calculateLocalityMinAge = (minAge: number, maxAge: number, frac: string | null) => {
  if (frac === null) {
    return minAge
  }
  const parts = frac.split(':')

  const numerator = parseInt(parts[0])
  const denominator = parseInt(parts[1])

  return maxAge - (maxAge - minAge) * (numerator - 1) / denominator
}