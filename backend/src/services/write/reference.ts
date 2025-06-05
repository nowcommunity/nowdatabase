import { EditDataType, FixBigInt, ReferenceDetailsType } from '../../../../frontend/src/shared/types'
import { getFieldsOfTables, nowDb } from '../../utils/db'
import { getReferenceDetails } from '../reference'
import { filterAllowedKeys, convertToPrismaDate } from './writeOperations/utils'
import { writeReferenceAuthors } from './author'
import { writeReferenceJournal } from './journal'
import Prisma from '../../../prisma/generated/now_test_client'

export const writeReference = async (reference: EditDataType<ReferenceDetailsType>) => {
  const allowedColumns = getFieldsOfTables(['ref_ref', 'ref_authors', 'ref_journal'])
  const filteredReference = filterAllowedKeys(reference, allowedColumns) as Prisma.ref_ref

  //frontend returns date as yyyy-MM-dd, prisma needs js Date object
  if (filteredReference.exact_date) {
    filteredReference.exact_date = convertToPrismaDate(filteredReference.exact_date.toString())
  }

  //First creates a reference > journal > updates reference with journal_id > creates authors
  //If something fails, nothing should go trough
  let referenceId: number

  if (!filteredReference.rid) {
    const newReference = await nowDb.ref_ref.create({
      data: {
        ...filteredReference,
        journal_id: null,
      },
    })
    referenceId = newReference.rid
  } else {
    await nowDb.ref_ref.update({
      where: { rid: filteredReference.rid },
      data: filteredReference,
    })
    referenceId = filteredReference.rid
  }

  let journalId: number | null = null
  if (reference.ref_journal) {
    if (reference.ref_journal.rowState !== 'removed') {
      const journal_id = await writeReferenceJournal(reference.ref_journal)
      journalId = journal_id
    } else journalId = null
  }

  //set reference.journal_id to null if a journal has been deleted
  await nowDb.ref_ref.update({
    where: { rid: referenceId },
    data: { journal_id: journalId },
  })

  if (reference.ref_authors) {
    const authorsToWrite = reference.ref_authors.filter(author => author.rowState !== 'removed')
    await writeReferenceAuthors(referenceId, authorsToWrite)
  }
  return referenceId
}

export const deleteReference = async (rid: number) => {
  const reference = (await getReferenceDetails(rid)) as EditDataType<FixBigInt<Prisma.ref_ref>>

  if (!reference) throw new Error('Reference not found')

  await nowDb.ref_authors.deleteMany({
    where: { rid: rid },
  })

  try {
    await nowDb.ref_ref.delete({
      where: { rid: rid },
    })
  } catch (error) {
    throw new Error('Failed to delete the reference')
  }
}
