import { EditDataType, FixBigInt, ReferenceJournalType } from '../../../../frontend/src/backendTypes'
import { getFieldsOfTables, nowDb } from '../../utils/db'
import { filterAllowedKeys } from './writeOperations/utils'
import Prisma from '../../../prisma/generated/now_test_client'

export const writeReferenceJournal = async (journal: EditDataType<FixBigInt<ReferenceJournalType>>) => {
  const allowedColumns = getFieldsOfTables(['ref_journal'])
  const filteredJournal = filterAllowedKeys(journal, allowedColumns) as FixBigInt<Prisma.ref_journal>

  const journal_id = await nowDb.$transaction(async prisma => {
    if (journal.journal_id) {
      const existingJournal = await prisma.ref_journal.findUnique({
        where: { journal_id: filteredJournal.journal_id },
      })
      if (existingJournal) {
        const updatedJournal = await prisma.ref_journal.update({
          where: { journal_id: existingJournal.journal_id },
          data: {
            journal_title: filteredJournal.journal_title,
            short_title: filteredJournal.short_title,
            alt_title: filteredJournal.alt_title,
            ISSN: filteredJournal.ISSN,
          },
        })
        return updatedJournal.journal_id
      } else {
        throw new Error('Journal ID was given but no matches were found in the DB')
      }
    } else {
      const newJournal = await prisma.ref_journal.create({
        data: {
          journal_title: filteredJournal.journal_title,
          short_title: filteredJournal.short_title,
          alt_title: filteredJournal.alt_title,
          ISSN: filteredJournal.ISSN,
        },
      })
      return newJournal.journal_id
    }
  })

  return journal_id
}
