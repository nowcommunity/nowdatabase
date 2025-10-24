import { logDb, nowDb } from '../utils/db'
import { validateTimeBound } from '../../../frontend/src/shared/validators/timeBound'
import { TimeBoundDetailsType, EditDataType, EditMetaData } from '../../../frontend/src/shared/types'
import Prisma from '../../prisma/generated/now_test_client'
import { ValidationObject, referenceValidator } from '../../../frontend/src/shared/validators/validator'
import { getReferenceDetails } from './reference'
import { buildPersonLookupByInitials, getPersonDisplayName, getPersonFromLookup } from './utils/person'

export const getAllTimeBounds = async () => {
  const result = await nowDb.now_tu_bound.findMany({
    select: {
      bid: true,
      b_name: true,
      age: true,
      b_comment: true,
    },
  })
  return result
}

export const getTimeBoundDetails = async (id: number) => {
  // TODO: Check if user has access

  const result = await nowDb.now_tu_bound.findUnique({
    where: { bid: id },
    include: {
      now_bau: {
        include: {
          now_br: {
            include: {
              ref_ref: {
                include: {
                  ref_authors: true,
                  ref_journal: true,
                },
              },
            },
          },
        },
      },
    },
  })
  if (!result) return null

  const buids = result.now_bau.map(bau => bau.buid)

  const logResult = await logDb.log.findMany({ where: { buid: { in: buids } } })

  const peopleLookup = await buildPersonLookupByInitials(
    result.now_bau.flatMap(bau => [bau.bau_coordinator, bau.bau_authorizer])
  )

  result.now_bau = result.now_bau.map(bau => {
    const coordinatorPerson = getPersonFromLookup(peopleLookup, bau.bau_coordinator)
    const authorizerPerson = getPersonFromLookup(peopleLookup, bau.bau_authorizer)

    const updates = logResult.filter((logRow: (typeof logResult)[number]) => logRow.buid === bau.buid)

    return {
      ...bau,
      bau_coordinator: getPersonDisplayName(coordinatorPerson, bau.bau_coordinator),
      bau_authorizer: getPersonDisplayName(authorizerPerson, bau.bau_authorizer),
      updates,
    }
  })

  return result
}

export const getTimeBoundTimeUnits = async (id: number) => {
  // TODO: Check if user has access
  const result = await nowDb.now_time_unit.findMany({
    where: { OR: [{ up_bnd: id }, { low_bnd: id }] },
  })
  return result
}

export const validateEntireTimeBound = async (editedFields: EditDataType<Prisma.now_bau> & EditMetaData) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateTimeBound(
      editedFields as EditDataType<TimeBoundDetailsType>,
      key as keyof TimeBoundDetailsType
    )
    if (error.error) errors.push(error)
  }
  let error = null
  if ('references' in editedFields && editedFields.references) {
    error = referenceValidator(editedFields.references)
    const invalidReferences: number[] = []
    for (const reference of editedFields.references) {
      const result = await getReferenceDetails(reference.rid)
      if (!result) {
        invalidReferences.push(reference.rid)
      }
    }
    if (invalidReferences.length > 0) {
      error = `References with ID(s) ${invalidReferences.join(', ')} do not exist`
    }
  } else {
    error = 'references-key is undefined in the data'
  }

  if (error) errors.push({ name: 'references', error: error })
  return errors
}
