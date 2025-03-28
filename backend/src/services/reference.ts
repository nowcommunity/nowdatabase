import { nowDb } from '../utils/db'
import { EditDataType, ReferenceDetailsType } from '../../../frontend/src/shared/types'
import { ValidationObject } from '../../../frontend/src/shared/validators/validator'
import { validateReference } from '../../../frontend/src/shared/validators/reference'
import Prisma from '../../prisma/generated/now_test_client'

export const getAllReferences = async () => {
  const result = await nowDb.ref_ref.findMany({
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
  const result = await nowDb.ref_ref.findUnique({
    where: { rid: id },
    include: { ref_authors: true, ref_journal: true },
  })

  if (!result) {
    return null
  }

  //changing exact_date to yyyy-mm-dd string since frontend uses that + we don't want to display ISO string in frontend
  if (result && result.exact_date) {
    const date = new Date(result.exact_date)
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    return { ...result, exact_date: formattedDate }
  }

  return result
}

// Fetch localities that have been updated by the given reference id
export const getReferenceLocalities = async (id: string) => {
  // TODO: Check if user has access
  const result = await nowDb.now_loc.findMany({
    where: {
      now_lau: {
        some: {
          now_lr: {
            some: { rid: parseInt(id) },
          },
        },
      },
    },
  })
  return result
}

// Fetch species that have been updated by the given reference id
export const getReferenceSpecies = async (id: string) => {
  // TODO: Check if user has access
  const result = await nowDb.com_species.findMany({
    where: {
      now_sau: {
        some: {
          now_sr: {
            some: { rid: parseInt(id) },
          },
        },
      },
    },
  })
  return result
}

export const getReferenceTypes = async () => {
  const referenceTypes = await nowDb.ref_ref_type.findMany({ include: { ref_field_name: true } })
  return referenceTypes
}

export const getReferenceAuthors = async () => {
  const uniqueReferenceAuthors = await nowDb.ref_authors.groupBy({
    by: ['author_surname', 'author_initials'],
    where: {
      author_surname: {
        not: null,
      },
    },
  })

  const sortedAuthors = uniqueReferenceAuthors
    .map((author, index) => ({
      data_id: index + 1,
      author_surname: author.author_surname,
      author_initials: author.author_initials,
    }))
    .filter(author => author.author_surname !== null)
    .sort((a, b) => a.author_surname!.localeCompare(b.author_surname!))

  return sortedAuthors
}

export const getAuthorsOfReference = async (rid: number) => {
  const authors = await nowDb.ref_authors.findMany({
    where: {
      rid: rid,
    },
  })
  return authors
}

export const getJournalById = async (journal_id: number) => {
  const authors = await nowDb.ref_journal.findMany({
    where: {
      journal_id: journal_id,
    },
  })
  return authors
}

export const getReferenceJournals = async () => {
  const referenceJournalTypes = await nowDb.ref_journal.findMany()
  return referenceJournalTypes
}

export const validateEntireReference = (editedFields: EditDataType<Prisma.ref_ref>) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateReference(
      editedFields as EditDataType<ReferenceDetailsType>,
      key as keyof ReferenceDetailsType
    )
    if (error.error) errors.push(error)
  }
  return errors
}
