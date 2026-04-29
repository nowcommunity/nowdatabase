import { nowDb } from '../utils/db'
import { TabListQueryOptions } from './tabularQuery'
import {
  buildReferenceDisplayLabelMap,
  type ReferenceTypeWithFieldNames,
  validateEntireReference,
} from './referenceValidation'
import { Role, User } from '../../../frontend/src/shared/types'
import { getIdsOfUsersProjects } from './locality'
import { referenceWithoutExactDateSelect } from './utils/referenceDate'

type RawReferenceExactDate = {
  exact_date: string | null
}

const normalizeRawExactDate = (value: string | null | undefined): string | null => {
  if (!value) return null
  const date = value.slice(0, 10)
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return null
  if (match[2] === '00' || match[3] === '00') return null
  return date
}

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

export const getReferenceDetails = async (id: number, _user?: User) => {
  const result = await nowDb.ref_ref.findUnique({
    where: { rid: id },
    select: referenceWithoutExactDateSelect,
  })

  if (!result) {
    return null
  }

  const exactDateRows = await nowDb.$queryRaw<RawReferenceExactDate[]>`
    SELECT CAST(exact_date AS CHAR) AS exact_date
    FROM ref_ref
    WHERE rid = ${id}
  `

  return { ...result, exact_date: normalizeRawExactDate(exactDateRows[0]?.exact_date) }
}

// Fetch localities that have been updated by the given reference id
export const getReferenceLocalities = async (id: string, options?: TabListQueryOptions, user?: User) => {
  const orderBy = options?.sorting.map(sort => ({
    [sort.id]: sort.desc ? 'desc' : 'asc',
  }))

  const referenceId = parseInt(id, 10)

  const visibilityWhere = await (async () => {
    if (user && [Role.Admin, Role.EditUnrestricted].includes(user.role)) return null
    if (!user) return { loc_status: false as const }
    const usersProjects = await getIdsOfUsersProjects(user)
    return {
      OR: [{ loc_status: { not: true } }, { now_plr: { some: { pid: { in: Array.from(usersProjects) } } } }],
    }
  })()

  const result = await nowDb.now_loc.findMany({
    where: {
      AND: [
        {
          now_lau: {
            some: {
              now_lr: {
                some: { rid: referenceId },
              },
            },
          },
        },
        ...(visibilityWhere ? [visibilityWhere] : []),
      ],
    },
    orderBy,
    skip: options?.skip,
    take: options?.take,
  })
  return result
}

// Fetch species that have been updated by the given reference id
export const getReferenceSpecies = async (id: string, options?: TabListQueryOptions, _user?: User) => {
  const orderBy = options?.sorting.map(sort => ({
    [sort.id]: sort.desc ? 'desc' : 'asc',
  }))

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
    orderBy,
    skip: options?.skip,
    take: options?.take,
  })
  return result
}

export const getReferenceTypes = async (): Promise<ReferenceTypeWithFieldNames[]> => {
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

export { buildReferenceDisplayLabelMap, validateEntireReference }
