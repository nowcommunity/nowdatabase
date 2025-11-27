import {
  EditDataType,
  Reference,
  TimeUnitDetailsType,
  LocalityDetailsType,
  User,
} from '../../../../frontend/src/shared/types'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from './writeOperations/writeHandler'
import { getFieldsOfTables, nowDb } from '../../utils/db'
import { ActionType } from './writeOperations/types'
import { getTimeUnitDetails } from '../timeUnit'
import { checkTimeUnitCascade } from '../../utils/cascadeHandler'
import { writeLocalityCascade } from './locality'

export class ConflictError extends Error {
  declare status: number
  constructor(message: string) {
    super(message)
    this.status = 409
  }
}

export const TIME_UNIT_IN_USE_MESSAGE =
  'Cannot delete time unit because it is referenced by other records (e.g., localities or time bounds).'

const FOREIGN_KEY_ERROR_CODES = ['ER_ROW_IS_REFERENCED', 'ER_ROW_IS_REFERENCED_2']

const isForeignKeyConstraintError = (error: unknown) => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    FOREIGN_KEY_ERROR_CODES.includes((error as { code: string }).code)
  )
}

const DUPLICATE_ENTRY_ERROR_CODE = 'ER_DUP_ENTRY'
const DUPLICATE_TIME_UNIT_MESSAGE = 'Time unit with the provided name already exists'

const normalizeTimeUnitName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[\s_-]+/g, '')
    .trim()

export class DuplicateTimeUnitError extends Error {
  declare status: number
  code: 'duplicate_name'

  constructor(message: string) {
    super(message)
    this.status = 409
    this.code = 'duplicate_name'
  }
}

const isDuplicateEntryError = (error: unknown) => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    (error as { code: string }).code === DUPLICATE_ENTRY_ERROR_CODE
  )
}

const assertTimeUnitIsNotInUse = async (id: string) => {
  const localityUsageCount = await nowDb.now_loc.count({
    where: {
      OR: [{ bfa_max: id }, { bfa_min: id }],
    },
  })

  if (localityUsageCount > 0) {
    throw new ConflictError(TIME_UNIT_IN_USE_MESSAGE)
  }
}

const assertTimeUnitNameIsUnique = async (displayName: string, existingId?: string) => {
  const normalizedName = normalizeTimeUnitName(displayName)

  const timeUnits = await nowDb.now_time_unit.findMany({
    select: { tu_name: true, tu_display_name: true },
  })

  const duplicate = timeUnits.find(timeUnit => {
    const normalizedExistingId = normalizeTimeUnitName(timeUnit.tu_name)
    const normalizedExistingDisplayName = normalizeTimeUnitName(timeUnit.tu_display_name)

    if (existingId && timeUnit.tu_name === existingId) {
      return false
    }

    return normalizedExistingId === normalizedName || normalizedExistingDisplayName === normalizedName
  })

  if (duplicate) {
    throw new DuplicateTimeUnitError(DUPLICATE_TIME_UNIT_MESSAGE)
  }
}

const getTimeUnitWriteHandler = (type: ActionType) => {
  return new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'now_time_unit',
    idColumn: 'tu_name',
    allowedColumns: getFieldsOfTables(['now_time_unit', 'now_tu_sequence', 'now_tau']),
    type,
  })
}

const createTimeUnitId = (displayName: string) => normalizeTimeUnitName(displayName)

const normalizeRank = (rank: TimeUnitDetailsType['rank'] | undefined): TimeUnitDetailsType['rank'] | undefined => {
  if (rank === '') return null
  return rank
}

export const writeTimeUnit = async (
  timeUnit: EditDataType<TimeUnitDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  authorizer: string
) => {
  const normalizedTimeUnit = { ...timeUnit, rank: normalizeRank(timeUnit.rank) }

  const writeHandler = getTimeUnitWriteHandler(normalizedTimeUnit.tu_name ? 'update' : 'add')
  const createdId = normalizedTimeUnit.tu_name ?? createTimeUnitId(normalizedTimeUnit.tu_display_name!)

  await assertTimeUnitNameIsUnique(normalizedTimeUnit.tu_display_name!, normalizedTimeUnit.tu_name)

  try {
    await writeHandler.start()

    const timeUnitToPersist: EditDataType<TimeUnitDetailsType> = { ...normalizedTimeUnit }

    if (timeUnitToPersist.tu_name) {
      await writeHandler.updateObject('now_time_unit', timeUnitToPersist, ['tu_name'])
      const { cascadeErrors, calculatorErrors, localitiesToUpdate } = await checkTimeUnitCascade(timeUnitToPersist)

      if (calculatorErrors.length > 0 || cascadeErrors.length > 0) {
        const calculatorErrorsString =
          calculatorErrors.length > 0 ? `Check fractions of following localities: ${calculatorErrors.join(', ')}` : ''
        const cascadeErrorsString =
          cascadeErrors.length > 0 ? `Following localities would become contradicting: ${cascadeErrors.join(', ')}` : ''
        const ErrorObject = {
          name: 'cascade',
          calculatorErrors: calculatorErrorsString,
          cascadeErrors: cascadeErrorsString,
        }
        await writeHandler.end()
        return { tu_name: timeUnit.tu_name, errorObject: ErrorObject }
      } else if (localitiesToUpdate.length > 0) {
        for (const locality of localitiesToUpdate) {
          await writeLocalityCascade(locality as EditDataType<LocalityDetailsType>, comment, references, authorizer)
        }
      }
    } else {
      timeUnitToPersist.tu_name = createTimeUnitId(timeUnitToPersist.tu_display_name!)
      await writeHandler.createObject('now_time_unit', timeUnitToPersist, ['tu_name'])
    }
    writeHandler.idValue = createdId
    await writeHandler.logUpdatesAndComplete(authorizer, comment ?? '', references ?? [])

    return { tu_name: timeUnitToPersist.tu_name, errorObject: undefined }
  } catch (e) {
    if (writeHandler.connection) {
      await writeHandler.end()
    }

    if (e instanceof DuplicateTimeUnitError) {
      throw e
    }

    if (isDuplicateEntryError(e)) {
      throw new DuplicateTimeUnitError(DUPLICATE_TIME_UNIT_MESSAGE)
    }

    throw e
  }
}

export const deleteTimeUnit = async (id: string, user: User) => {
  const timeUnit = await getTimeUnitDetails(id)
  if (!timeUnit) throw new Error('Time unit not found')

  await assertTimeUnitIsNotInUse(id)

  const writeHandler = getTimeUnitWriteHandler('delete')
  try {
    await writeHandler.start()
    await writeHandler.deleteObject('now_time_unit', timeUnit, ['tu_name'])
    await writeHandler.logUpdatesAndComplete(user.initials)
  } catch (e) {
    if (writeHandler.connection) {
      await writeHandler.end()
    }

    if (isForeignKeyConstraintError(e)) {
      throw new ConflictError(TIME_UNIT_IN_USE_MESSAGE)
    }

    throw e
  }
}

export const logTimeUnit = (
  timeUnit: EditDataType<TimeUnitDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  authorizer: string
) => {
  if (timeUnit && comment && references && authorizer) {
    // TODO
  }
  // TODO
}
