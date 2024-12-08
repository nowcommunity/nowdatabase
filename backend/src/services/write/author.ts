import { EditDataType, FixBigInt, ReferenceAuthorType } from '../../../../frontend/src/shared/types/dbTypes'
import { getFieldsOfTables, nowDb } from '../../utils/db'
import { filterAllowedKeys } from './writeOperations/utils'
import Prisma from '../../../prisma/generated/now_test_client'

export const writeReferenceAuthors = async (rid: number, authors: EditDataType<FixBigInt<ReferenceAuthorType>>[]) => {
  const allowedColumns = getFieldsOfTables(['ref_authors'])
  //transaction so if adding a new author fails later on the deleted authors aren't lost
  await nowDb.$transaction(async prisma => {
    // All previous authors are deleted before inserting new ones. Check documentation for why this is
    await prisma.ref_authors.deleteMany({
      where: { rid: rid },
    })

    for (const author of authors) {
      const filteredAuthor = filterAllowedKeys(author, allowedColumns) as FixBigInt<Prisma.ref_authors>

      await prisma.ref_authors.create({
        data: {
          rid: rid,
          field_id: filteredAuthor.field_id,
          au_num: filteredAuthor.au_num,
          author_surname: filteredAuthor.author_surname,
          author_initials: filteredAuthor.author_initials,
        },
      })
    }
  })
}
