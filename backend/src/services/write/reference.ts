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
    allowedColumns: getFieldsOfTables(['ref_ref', 'ref_authors', 'ref_journal', 'now_lr', 'now_sr']),
    type,
  })
}

//Reference from frontend has some helper fields that are not present in the DB
//This function creates a copy of any frontend object that only has the keys that should go into th DB
const filterAllowedKeys = <T extends Record<string, T[keyof T]>>(reference: T, allowedKeys: string[]) => {
  return allowedKeys
    .filter(key => key in reference)
    .reduce((obj, key) => {
      ;(obj as T)[key as keyof T] = reference[key as keyof T]
      return obj
    }, {} as Partial<T>)
}

export const writeReference = async (reference: EditDataType<ReferenceDetailsType>) => {
  const allowedColumns = getFieldsOfTables(['ref_ref', 'ref_authors', 'ref_journal', 'now_lr', 'now_sr'])
  const filteredReference = filterAllowedKeys(reference, allowedColumns)

  const writeHandler = getReferenceWriteHandler(filteredReference.rid ? 'update' : 'add')

  try {
    await writeHandler.start()

    if (!filteredReference.rid) {
      const { rid: newId } = await writeHandler.createObject('ref_ref', filteredReference, ['rid'])
      reference.rid = newId as number
    } else {
      await writeHandler.updateObject('ref_ref', filteredReference, ['rid'])
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
