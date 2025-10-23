import Prisma from '../../../prisma/generated/now_test_client'

const UNKNOWN_DISPLAY_NAME = 'Unknown'

type PersonNameSource = Pick<Prisma.com_people, 'first_name' | 'surname' | 'initials'>

const buildFullName = (person: PersonNameSource | null | undefined) => {
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

export const getPersonDisplayName = (
  person: PersonNameSource | null | undefined,
  fallback?: string | null
) => {
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
