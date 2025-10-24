import Prisma from '../../../prisma/generated/now_test_client'

const UNKNOWN_DISPLAY_NAME = 'Unknown'

type PersonNameSource = Pick<Prisma.com_people, 'first_name' | 'surname' | 'initials'>

type NowDbClient = typeof import('../../utils/db').nowDb

let cachedNowDb: NowDbClient | null = null

const getNowDb = async () => {
  if (!cachedNowDb) {
    const module = await import('../../utils/db')
    cachedNowDb = module.nowDb
  }

  return cachedNowDb
}

const normalizeInitials = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : null
}

export const buildPersonLookupByInitials = async (
  initials: Array<string | null | undefined>
): Promise<Map<string, PersonNameSource>> => {
  const uniqueInitials = Array.from(
    new Set(initials.map(normalizeInitials).filter((value): value is string => Boolean(value)))
  )

  if (uniqueInitials.length === 0) {
    return new Map()
  }

  const nowDb = await getNowDb()

  const people = await nowDb.com_people.findMany({
    where: { initials: { in: uniqueInitials } },
    select: { first_name: true, surname: true, initials: true },
  })

  return new Map(people.flatMap(person => (person.initials ? [[person.initials, person]] : [])))
}

export const getPersonFromLookup = (
  lookup: Map<string, PersonNameSource>,
  initials: string | null | undefined
): PersonNameSource | undefined => {
  const key = normalizeInitials(initials)
  return key ? lookup.get(key) : undefined
}

const buildFullName = (person: PersonNameSource | null | undefined): string | null => {
  if (!person) return null

  const parts = [person.first_name, person.surname]
    .map(part => part?.trim())
    .filter((part): part is string => Boolean(part && part.length > 0))

  if (parts.length > 0) {
    return parts.join(' ')
  }

  const initials = person.initials?.trim()
  return initials && initials.length > 0 ? initials : null
}

export const getPersonDisplayName = (person: PersonNameSource | null | undefined, fallback?: string | null): string => {
  const fullName = buildFullName(person)
  if (fullName) {
    return fullName
  }

  const safeFallback = fallback?.trim()
  if (safeFallback && safeFallback.length > 0) {
    return safeFallback
  }

  return UNKNOWN_DISPLAY_NAME
}
