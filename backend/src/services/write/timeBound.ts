import { EditDataType, Reference, TimeBoundDetailsType, User } from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from '../writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'
import { ActionType } from '../writeOperations/types'
import { getTimeBoundDetails } from '../timeBound'

const getTimeBoundWriteHandler = (type: ActionType) => {
  return new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'now_tu_bound',
    idColumn: 'bid',
    allowedColumns: getFieldsOfTables(['now_tu_bound']),
    type: type,
  })
}

export const writeTimeBound = async (
  timeBound: EditDataType<TimeBoundDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  authorizer: string
) => {
  const writeHandler = getTimeBoundWriteHandler(timeBound.bid ? 'update' : 'add')

  try {
    await writeHandler.start()

    const result = await writeHandler.upsertObject('now_tu_bound', timeBound, ['bid'])
    writeHandler.idValue = result!.bid as number
    await writeHandler.logUpdatesAndComplete(authorizer, comment ?? '', references ?? [])
    await writeHandler.commit()

    return timeBound.bid
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}

export const deleteTimeUnit = async (id: number, user: User) => {
  const timeBound = await getTimeBoundDetails(id)
  if (!timeBound) throw new Error('Time bound not found')
  const writeHandler = getTimeBoundWriteHandler('delete')
  try {
    await writeHandler.start()
    await writeHandler.deleteObject('now_tu_bound', timeBound, ['bid'])
    await writeHandler.logUpdatesAndComplete(user.initials)
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}
