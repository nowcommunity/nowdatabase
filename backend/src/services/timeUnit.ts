import { logDb, nowDb } from '../utils/db'
import { EditDataType, TimeUnitDetailsType, EditMetaData } from '../../../frontend/src/shared/types'
import { ValidationObject, referenceValidator } from '../../../frontend/src/shared/validators/validator'
import { validateTimeUnit } from '../../../frontend/src/shared/validators/timeUnit'
import { getReferenceDetails } from './reference'
import { getPersonDisplayName } from './utils/person'

export const getAllTimeUnits = async () => {
  const result = await nowDb.now_time_unit.findMany({
    select: {
      tu_name: true,
      tu_display_name: true,
      rank: true,
      now_tu_sequence: {
        select: {
          seq_name: true,
        },
      },
      now_tu_bound_now_time_unit_low_bndTonow_tu_bound: {
        select: {
          age: true,
        },
      },
      now_tu_bound_now_time_unit_up_bndTonow_tu_bound: {
        select: {
          age: true,
        },
      },
    },
  })

  return result.map(item => ({
    tu_name: item.tu_name,
    tu_display_name: item.tu_display_name,
    rank: item.rank,
    low_bound: item.now_tu_bound_now_time_unit_low_bndTonow_tu_bound.age,
    up_bound: item.now_tu_bound_now_time_unit_up_bndTonow_tu_bound.age,
    seq_name: item.now_tu_sequence.seq_name,
  }))
}

export const getTimeUnitDetails = async (id: string) => {
  // TODO: Check if user has access
  const result = await nowDb.now_time_unit.findUnique({
    where: { tu_name: id },
    include: {
      now_tu_sequence: {},
      now_tu_bound_now_time_unit_low_bndTonow_tu_bound: {},
      now_tu_bound_now_time_unit_up_bndTonow_tu_bound: {},
      now_tau: {
        include: {
          now_tr: {
            include: {
              ref_ref: {
                include: {
                  ref_authors: true,
                  ref_journal: true,
                },
              },
            },
          },
          com_people_now_tau_tau_coordinatorTocom_people: {
            select: { first_name: true, surname: true, initials: true },
          },
          com_people_now_tau_tau_authorizerTocom_people: {
            select: { first_name: true, surname: true, initials: true },
          },
        },
      },
    },
  })

  if (!result) return null

  const tuids = result.now_tau.map(tau => tau.tuid)

  const logResult = await logDb.log.findMany({ where: { tuid: { in: tuids } } })

  result.now_tau = result.now_tau.map(tau => {
    const {
      com_people_now_tau_tau_coordinatorTocom_people: coordinatorPerson,
      com_people_now_tau_tau_authorizerTocom_people: authorizerPerson,
      ...rest
    } = tau

    const updates = logResult.filter(logRow => logRow.tuid === rest.tuid)

    const fallbackCoordinator = rest.tau_coordinator
    const fallbackAuthorizer = rest.tau_authorizer

    return {
      ...rest,
      tau_coordinator: getPersonDisplayName(coordinatorPerson, fallbackCoordinator),
      tau_authorizer: getPersonDisplayName(authorizerPerson, fallbackAuthorizer),
      updates,
    }
  })

  const {
    now_tu_bound_now_time_unit_low_bndTonow_tu_bound: low_bound,
    now_tu_bound_now_time_unit_up_bndTonow_tu_bound: up_bound,
    ...rest
  } = result
  return { ...rest, low_bound, up_bound }
}

export const getTimeUnitLocalities = async (id: string) => {
  // TODO: Check if user has access
  const result = await nowDb.now_loc.findMany({
    where: { OR: [{ bfa_max: id }, { bfa_min: id }] },
  })
  return result
}

export const validateEntireTimeUnit = async (editedFields: EditDataType<TimeUnitDetailsType> & EditMetaData) => {
  const keys = Object.keys(editedFields)
  const messages: ValidationObject[] = []
  for (const key of keys) {
    const error = validateTimeUnit(editedFields, key as keyof TimeUnitDetailsType)
    if (error.error) messages.push(error)
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

  if (error) messages.push({ name: 'references', error: error })
  return messages
}
