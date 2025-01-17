import { EditDataType, Reference, User, RegionDetails } from '../../../../frontend/src/shared/types'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from './writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'
import { ActionType } from './writeOperations/types'

const getRegionWriteHandler = (type: ActionType) => {
  return new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'now_reg_coord',
    idColumn: 'reg_coord_id',
    allowedColumns: getFieldsOfTables(['now_reg_coord']),
    type: type,
  })
}

export const writeRegion = async (
  region: EditDataType<RegionDetails>,
  comment: string | undefined,
  references: Reference[] | undefined,
  user: User | undefined
) => {
  const authorizer = user!.initials
  const writeHandler = getRegionWriteHandler('update') // hardcoded for now to avoid issues
  try {
    await writeHandler.start()

    if (!region.reg_coord_id) {
      console.log('No creating new regions for now')
      return false
    } else {
      await writeHandler.updateObject('now_reg_coord', region, ['reg_coord_id'])
    }

    writeHandler.idValue = region.reg_coord_id
    await writeHandler.commit()
    await writeHandler.end()
    //await writeHandler.logUpdatesAndComplete(authorizer, comment ?? '', references ?? [])
    return region.reg_coord_id
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}
