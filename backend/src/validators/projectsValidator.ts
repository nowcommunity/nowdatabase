import { PROJECT_STATUSES, type ProjectStatus, RECORD_STATUS_VALUES } from '../constants/status'

export class ValidationError extends Error {
  declare status: number

  constructor(message: string) {
    super(message)
    this.status = 400
  }
}

export class NotFoundError extends Error {
  declare status: number

  constructor(message: string) {
    super(message)
    this.status = 404
  }
}

export const ensureNonEmptyString = (value: unknown, fieldName: string) => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${fieldName} is required`)
  }

  return value.trim()
}

export const ensureValidUserId = (value: unknown, fieldName: string) => {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`)
  }

  return value
}

export const ensureValidMemberIds = (memberUserIds: unknown) => {
  if (memberUserIds === undefined) return [] as number[]

  if (!Array.isArray(memberUserIds)) {
    throw new ValidationError('Project members must be an array of user IDs')
  }

  const numericIds = memberUserIds.filter((id): id is number => typeof id === 'number' && Number.isInteger(id))

  if (numericIds.length !== memberUserIds.length) {
    throw new ValidationError('Project members must be an array of user IDs')
  }

  return Array.from(new Set(numericIds))
}

export const ensureValidProjectStatus = (value: unknown): ProjectStatus | null => {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string' || !PROJECT_STATUSES.includes(value as ProjectStatus)) {
    throw new ValidationError('Project status is invalid')
  }

  return value as ProjectStatus
}

export const ensureValidRecordStatus = (value: unknown): boolean | null => {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'boolean' || !RECORD_STATUS_VALUES.includes(value)) {
    throw new ValidationError('Record status is invalid')
  }

  return value
}
