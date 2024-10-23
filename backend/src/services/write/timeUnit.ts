import { EditDataType, LocalityDetailsType, Reference, TimeUnitDetailsType, User } from '../../../../frontend/src/backendTypes'
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

  const loggerInfo = {
    authorizer,
    comment,
    references,
  }

  try {
    await writeHandler.start()

    if (timeUnit.tu_name) {
      await writeHandler.updateObject('now_time_unit', timeUnit, ['tu_name'])
      const { cascadeErrors, calculatorErrors, localitiesToUpdate } = await checkTimeUnitCascade(timeUnit, loggerInfo)
      if (calculatorErrors.length > 0) {
        throw new Error(`Following localities have invalid age values: \n${calculatorErrors.join('\n')}`)
      }
      if (cascadeErrors.length > 0) {
        throw new Error(`Following localities would be contradicting: \n${cascadeErrors.join('\n')}`)
      } else {
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
    await writeHandler.commit()

    return timeUnit.tu_name
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
