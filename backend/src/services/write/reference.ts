import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { EditDataType, FixBigInt, ReferenceDetailsType } from '../../../../frontend/src/shared/types'
import { getFieldsOfTables, nowDb } from '../../utils/db'
import { getReferenceDetails } from '../reference'
import { filterAllowedKeys, convertToPrismaDate } from './writeOperations/utils'
import { writeReferenceAuthors } from './author'
import { writeReferenceJournal } from './journal'
import Prisma from '../../../prisma/generated/now_test_client'

const REFERENCE_HAS_UPDATES_ERROR_MESSAGE = 'The Reference with associated updates cannot be deleted.'

class ConflictError extends Error {
  declare status: number
  constructor(message: string) {
    super(message)
    this.status = 409
  }
}

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

type ReferenceCountClient = Pick<typeof nowDb, 'now_lr' | 'now_sr' | 'now_br' | 'now_tr' | 'now_tur'>

export const getReferenceDeleteStatus = async (rid: number, client: ReferenceCountClient = nowDb) => {
  const [localities, species, timeBounds, timeUnits, timeUnitBounds] = await Promise.all([
    client.now_lr.count({ where: { rid } }),
    client.now_sr.count({ where: { rid } }),
    client.now_br.count({ where: { rid } }),
    client.now_tr.count({ where: { rid } }),
    client.now_tur.count({ where: { rid } }),
  ])

  const linkedEntities = [
    localities > 0 ? 'Localities' : null,
    species > 0 ? 'Species' : null,
    timeBounds > 0 ? 'Time Bounds' : null,
    timeUnits > 0 ? 'Time Units' : null,
    timeUnitBounds > 0 ? 'Time Unit Bounds' : null,
  ].filter((entity): entity is string => entity !== null)

  return { canDelete: linkedEntities.length === 0, linkedEntities }
}

export const deleteReference = async (rid: number) => {
  const reference = (await getReferenceDetails(rid)) as EditDataType<FixBigInt<Prisma.ref_ref>>

  if (!reference) throw new Error('Reference not found')

  try {
    await nowDb.$transaction(async prisma => {
      const { canDelete } = await getReferenceDeleteStatus(rid, prisma)

      if (!canDelete) {
        throw new ConflictError(REFERENCE_HAS_UPDATES_ERROR_MESSAGE)
      }

      await prisma.ref_authors.deleteMany({
        where: { rid },
      })

      await prisma.ref_ref.delete({
        where: { rid },
      })
    })
  } catch (error) {
    if (error instanceof ConflictError) {
      throw error
    }

    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new ConflictError(REFERENCE_HAS_UPDATES_ERROR_MESSAGE)
    }

    throw new Error('Failed to delete the reference')
  }
}
