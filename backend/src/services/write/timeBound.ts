import { EditDataType, Reference, TimeBoundDetailsType } from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from '../writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'

export const writeTimeBound = async (
  timeBound: EditDataType<TimeBoundDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  authorizer: string
) => {
  const writeHandler = new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'now_tu_bound',
    idColumn: 'bid',
    allowedColumns: getFieldsOfTables(['now_tu_bound']),
    type: timeBound.bid ? 'update' : 'add',
  })
  try {
    await writeHandler.start()

    const result = await writeHandler.upsertObject('now_tu_bound', timeBound, ['bid'])
    writeHandler.idValue = result!.bid as number
    await writeHandler.logUpdatesAndComplete(comment ?? '', references ?? [], authorizer)
    await writeHandler.commit()

    return timeBound.bid
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}
