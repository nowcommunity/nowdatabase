import { EditDataType, Reference, TimeBoundDetailsType, User } from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from './writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'
import { ActionType } from './writeOperations/types'
import { getTimeBoundDetails } from '../timeBound'

const getTimeBoundWriteHandler = (type: ActionType) => {
  const timeBoundWriteHandler = new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'now_tu_bound',
    idColumn: 'bid',
    allowedColumns: getFieldsOfTables(['now_tu_bound', 'now_bau']),
    type: type,
  })
  return timeBoundWriteHandler
}

export const writeTimeBound = async (
  timeBound: EditDataType<TimeBoundDetailsType>,
  comment: string | undefined,
  references: Reference[] | undefined,
  authorizer: string
) => {
  const writeHandlerType = timeBound.bid ? 'update' : 'add'
  const writeHandler = getTimeBoundWriteHandler(writeHandlerType)

  try {
    await writeHandler.start()
    const result = await writeHandler.upsertObject('now_tu_bound', timeBound, ['bid'])
    if (result) {
      writeHandler.idValue = result.bid as number // this happens only if a new timebound is created
    } else {
      writeHandler.idValue = timeBound.bid as number
    }
    await writeHandler.logUpdatesAndComplete(authorizer, comment ?? '', references ?? [])
    return timeBound.bid as number
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}

export const deleteTimeBound = async (id: number, user: User) => {
  const timeBound = await getTimeBoundDetails(id)
  if (!timeBound) throw new Error('Time bound not found')
  const writeHandler = getTimeBoundWriteHandler('delete', id)
  try {
    await writeHandler.start()
    await writeHandler.deleteObject('now_tu_bound', timeBound, ['bid'])
    await writeHandler.logUpdatesAndComplete(user.initials)
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}
