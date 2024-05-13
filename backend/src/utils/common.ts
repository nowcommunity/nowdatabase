export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const fixBigInt = (obj: object | null) => obj === null ? null : JSON.stringify(
  obj,
  (_key, value) => (typeof value === 'bigint' ? value.toString() : value)
)
