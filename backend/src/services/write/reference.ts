import {
  EditDataType,
  FixBigInt,
  PrismaReference,
  ReferenceDetailsType,
  User,
} from '../../../../frontend/src/backendTypes'
import { NOW_DB_NAME } from '../../utils/config'
import { WriteHandler } from './writeOperations/writeHandler'
import { getFieldsOfTables } from '../../utils/db'
import { ActionType } from './writeOperations/types'
import { getReferenceDetails } from '../reference'

const getReferenceWriteHandler = (type: ActionType) => {
  return new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'ref_ref',
    idColumn: 'rid',
    allowedColumns: getFieldsOfTables(['com_species', 'now_sau', 'now_lau']),
    type,
  })
}

export const writeReference = async (reference: EditDataType<ReferenceDetailsType>) => {
  const writeHandler = getReferenceWriteHandler(reference.rid ? 'update' : 'add')
  try {
    await writeHandler.start()

    if (!reference.rid) {
      const { rid: newId } = await writeHandler.createObject('ref_ref', reference, ['rid'])
      reference.rid = newId as number
    } else {
      await writeHandler.updateObject('ref_ref', reference, ['species_id'])
    }

    writeHandler.idValue = reference.rid

    await writeHandler.commit()

    return reference.rid
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}

export const deleteReference = async (rid: number, user: User) => {
  const reference = (await getReferenceDetails(rid)) as EditDataType<FixBigInt<PrismaReference>>
  if (!reference) throw new Error('Reference not found')

  const writeHandler = getReferenceWriteHandler('delete')
  await writeHandler.start()
  writeHandler.idValue = reference.rid

  try {
    await writeHandler.deleteObject('ref_ref', reference, ['rid'])
    await writeHandler.logUpdatesAndComplete(user.initials)
  } catch (e) {
    await writeHandler.end()
    throw e
  }
}
