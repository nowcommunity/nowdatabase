import { EditDataType, Reference, TimeUnitDetailsType } from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from '../writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'

export const writeTimeUnit = async (
  timeUnit: EditDataType<TimeUnitDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  authorizer: string
) => {
  const writeHandler = new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'now_time_unit',
    idColumn: 'tu_name',
    allowedColumns: getFieldsOfTables(['now_time_unit', 'now_tu_sequence']),
    type: timeUnit.tu_name ? 'update' : 'add',
  })

  const createdId = createTimeUnitId(timeUnit.tu_display_name!)

  try {
    await writeHandler.start()

    if (timeUnit.tu_name) {
      await writeHandler.updateObject('now_time_unit', timeUnit, ['tu_name'])
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

const createTimeUnitId = (displayName: string) => displayName.toLowerCase().replace(' ', '')
