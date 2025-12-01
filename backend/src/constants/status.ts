export const PROJECT_STATUSES = ['current', 'no_data', 'finished'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const RECORD_STATUS_VALUES = [true, false] as const
