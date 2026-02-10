export type MesowearNumericInput = number | null | undefined | ''

const toNumberOrNull = (value: MesowearNumericInput): number | null => {
  if (value === '' || value === null || value === undefined) return null
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  return value
}

export const calculateNormalizedMesowearScore = (
  mwScaleMin: MesowearNumericInput,
  mwScaleMax: MesowearNumericInput,
  mwValue: MesowearNumericInput
): string | null => {
  const parsedMwScaleMin = toNumberOrNull(mwScaleMin)
  const parsedMwScaleMax = toNumberOrNull(mwScaleMax)
  const parsedMwValue = toNumberOrNull(mwValue)

  if (parsedMwScaleMin === null || parsedMwScaleMax === null || parsedMwValue === null) return null

  const scaleDifference = parsedMwScaleMax - parsedMwScaleMin
  const scale = scaleDifference <= 0 ? 1 : scaleDifference
  const value = parsedMwValue - parsedMwScaleMin < 0 ? 0 : parsedMwValue - parsedMwScaleMin

  if (parsedMwValue < parsedMwScaleMin) return null

  const mesowearScore = (value / scale) * 100
  const check = Math.trunc(mesowearScore)

  if (check < 0 || check > 100) return null

  return mesowearScore.toFixed(2)
}
