export const projectStatusOptions = [
  { value: 'current', label: 'Current' },
  { value: 'no_data', label: 'No data' },
  { value: 'finished', label: 'Finished' },
] as const

export type ProjectStatusValue = (typeof projectStatusOptions)[number]['value']

export const recordStatusOptions = [
  { value: true, label: 'Public' },
  { value: false, label: 'Private' },
] as const

export type RecordStatusValue = (typeof recordStatusOptions)[number]['value']
