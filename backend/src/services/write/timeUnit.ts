import {
  EditDataType,
  Reference,
  TimeUnitDetailsType,
  LocalityDetailsType,
  User,
} from '../../../../frontend/src/shared/types'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from './writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'
import { ActionType } from './writeOperations/types'
import { getTimeUnitDetails } from '../timeUnit'
import { checkTimeUnitCascade } from '../../utils/cascadeHandler'
import { writeLocalityCascade } from './locality'

const getTimeUnitWriteHandler = (type: ActionType) => {
  return new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'now_time_unit',
    idColumn: 'tu_name',
    allowedColumns: getFieldsOfTables(['now_time_unit', 'now_tu_sequence', 'now_tau']),
    type,
  })
}

const createTimeUnitId = (displayName: string) => displayName.toLowerCase().replace(' ', '')

export const writeTimeUnit = async (
  timeUnit: EditDataType<TimeUnitDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  authorizer: string
) => {
  const writeHandler = getTimeUnitWriteHandler(timeUnit.tu_name ? 'update' : 'add')

  const createdId = createTimeUnitId(timeUnit.tu_display_name!)

  try {
    await writeHandler.start()

    if (timeUnit.tu_name) {
      await writeHandler.updateObject('now_time_unit', timeUnit, ['tu_name'])
      const { cascadeErrors, calculatorErrors, localitiesToUpdate } = await checkTimeUnitCascade(timeUnit)

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
      timeUnit.tu_name = createTimeUnitId(timeUnit.tu_display_name!)
      await writeHandler.createObject('now_time_unit', timeUnit, ['tu_name'])
    }
    writeHandler.idValue = createdId
    await writeHandler.logUpdatesAndComplete(authorizer, comment ?? '', references ?? [])

    return { tu_name: timeUnit.tu_name, errorObject: undefined }
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}

export const deleteTimeUnit = async (id: string, user: User) => {
  const timeUnit = await getTimeUnitDetails(id)
  if (!timeUnit) throw new Error('Time unit not found')
  const writeHandler = getTimeUnitWriteHandler('delete')
  try {
    await writeHandler.start()
    await writeHandler.deleteObject('now_time_unit', timeUnit, ['tu_name'])
    await writeHandler.logUpdatesAndComplete(user.initials)
  } catch (e) {
    await writeHandler.end()
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
