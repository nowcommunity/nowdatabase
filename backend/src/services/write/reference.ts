import { EditDataType, FixBigInt, PrismaReference, ReferenceDetailsType } from '../../../../frontend/src/backendTypes'
import { getFieldsOfTables, nowDb } from '../../utils/db'
import { getReferenceDetails } from '../reference'
import { filterAllowedKeys } from './writeOperations/utils'

export const writeReference = async (reference: EditDataType<FixBigInt<ReferenceDetailsType>>) => {
  const allowedColumns = getFieldsOfTables(['ref_ref', 'ref_authors', 'ref_journal'])
  const filteredReference = filterAllowedKeys(reference, allowedColumns) as FixBigInt<PrismaReference>

  if (!filteredReference.rid) {
    const newReference = await nowDb.ref_ref.create({
      data: filteredReference,
    })
    reference.rid = newReference.rid
  } else {
    await nowDb.ref_ref.update({
      where: { rid: filteredReference.rid },
      data: filteredReference,
    })
  }

  return reference.rid
}

export const deleteReference = async (rid: number) => {
  const reference = (await getReferenceDetails(rid)) as EditDataType<FixBigInt<PrismaReference>>

  if (!reference) throw new Error('Reference not found')

  await nowDb.ref_ref.delete({
    where: { rid },
  })
}
