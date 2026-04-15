export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const fixBigInt = (value: unknown) => {
  if (value === null || value === undefined) return value
  const parsed: unknown = JSON.parse(JSON.stringify(value, bigintToNumberReplacer))
  return parsed
}

const bigintToNumberReplacer = (_key: string, innerValue: unknown): unknown =>
  typeof innerValue === 'bigint' ? Number(innerValue) : innerValue
