export const mkConfig = <T,>(config: T) => config

export const generateCsv =
  <T,>(_config: T) =>
  (_rows: unknown) =>
    'csv'

export const download =
  <T,>(_config: T) =>
  (_csv: string) =>
    undefined
