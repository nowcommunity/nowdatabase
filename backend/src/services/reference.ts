import { prisma } from '../utils/db'

export const getAllReferences = async () => {
  const result = await prisma.ref_ref.findMany({
    select: {
      rid: true,
      date_primary: true,
      title_primary: true,
      title_secondary: true,
      ref_journal: {
        select: {
          journal_title: true,
        },
      },
      ref_authors: {
        select: {
          au_num: true,
          author_surname: true,
          author_initials: true,
        },
      },
      ref_ref_type: {
        select: {
          ref_type: true,
        },
      },
    },
  })

  return result
}

export const getReferenceDetails = async (id: number) => {
  // TODO: Check if user has access
  const result = await prisma.ref_ref.findUnique({ where: { rid: id } })
  return result
}

export const getReferenceTypes = async () => {
  const referenceTypes = await prisma.ref_ref_type.findMany({ include: { ref_field_name: true } })
  return referenceTypes
}
