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

  await writeHandler.start()

  writeHandler.idValue = timeUnit.tu_name
  await writeHandler.upsertObject('now_time_unit', timeUnit, ['tu_name'])
  await writeHandler.logUpdatesAndComplete(comment ?? '', references ?? [], authorizer)
  await writeHandler.end()

  return timeUnit.tu_name
}
