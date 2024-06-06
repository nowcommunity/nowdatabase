export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const fixBigInt = (obj: object | null) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  obj === null ? null : JSON.stringify(obj, (_key, value) => (typeof value === 'bigint' ? Number(value) : value))
