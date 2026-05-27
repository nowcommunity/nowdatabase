import { logDb, nowDb } from '../utils/db'
import { EditDataType, TimeUnitDetailsType, EditMetaData } from '../../../frontend/src/shared/types'
import { ValidationObject, referenceValidator } from '../../../frontend/src/shared/validators/validator'
import { validateTimeUnit } from '../../../frontend/src/shared/validators/timeUnit'
import { getReferenceDetails } from './reference'
import { buildPersonLookupByInitials, getPersonDisplayName, getPersonFromLookup } from './utils/person'
import { TabListQueryOptions } from './tabularQuery'
import { addNullExactDateToReferenceJoins, referenceWithoutExactDateSelect } from './utils/referenceDate'

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
    low_bound: item.now_tu_bound_now_time_unit_low_bndTonow_tu_bound?.age ?? null,
    up_bound: item.now_tu_bound_now_time_unit_up_bndTonow_tu_bound?.age ?? null,
    seq_name: item.now_tu_sequence?.seq_name ?? null,
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
                select: referenceWithoutExactDateSelect,
              },
            },
          },
        },
      },
      now_time_update: {
        include: {
          now_tau: {
            include: {
              now_tr: {
                include: {
                  ref_ref: {
                    select: referenceWithoutExactDateSelect,
                  },
                },
              },
            },
          },
          now_bau_now_time_update_lower_buidTonow_bau: {
            include: {
              now_br: {
                include: {
                  ref_ref: {
                    select: referenceWithoutExactDateSelect,
                  },
                },
              },
            },
          },
          now_bau_now_time_update_upper_buidTonow_bau: {
            include: {
              now_br: {
                include: {
                  ref_ref: {
                    select: referenceWithoutExactDateSelect,
                  },
                },
              },
            },
          },
        },
        orderBy: [{ date: 'asc' }, { time_update_id: 'asc' }],
      },
    },
  })

  if (!result) return null

  const tuids = result.now_tau.map(tau => tau.tuid)
  const timeUpdateTuids = result.now_time_update.flatMap(update => (update.tuid ? [update.tuid] : []))
  const timeUpdateBuids = result.now_time_update.flatMap(update =>
    [update.lower_buid, update.upper_buid].filter((buid): buid is number => typeof buid === 'number')
  )

  const [timeUnitLogRows, timeBoundLogRows] = await Promise.all([
    logDb.log.findMany({ where: { tuid: { in: Array.from(new Set([...tuids, ...timeUpdateTuids])) } } }),
    logDb.log.findMany({ where: { buid: { in: Array.from(new Set(timeUpdateBuids)) } } }),
  ])

  const peopleLookup = await buildPersonLookupByInitials(
    [
      ...result.now_tau.flatMap(tau => [tau.tau_coordinator, tau.tau_authorizer]),
      ...result.now_time_update.flatMap(update => [update.coordinator, update.authorizer]),
      ...result.now_time_update.flatMap(update => [
        update.now_tau?.tau_coordinator,
        update.now_tau?.tau_authorizer,
        update.now_bau_now_time_update_lower_buidTonow_bau?.bau_coordinator,
        update.now_bau_now_time_update_lower_buidTonow_bau?.bau_authorizer,
        update.now_bau_now_time_update_upper_buidTonow_bau?.bau_coordinator,
        update.now_bau_now_time_update_upper_buidTonow_bau?.bau_authorizer,
      ]),
    ].filter((initials): initials is string => typeof initials === 'string')
  )

  const formatTimeUnitUpdate = (tau: (typeof result.now_tau)[number]) => {
    const coordinatorPerson = getPersonFromLookup(peopleLookup, tau.tau_coordinator)
    const authorizerPerson = getPersonFromLookup(peopleLookup, tau.tau_authorizer)

    const updates = timeUnitLogRows.filter((logRow: (typeof timeUnitLogRows)[number]) => logRow.tuid === tau.tuid)

    return {
      ...tau,
      tau_coordinator: getPersonDisplayName(coordinatorPerson, tau.tau_coordinator),
      tau_authorizer: getPersonDisplayName(authorizerPerson, tau.tau_authorizer),
      now_tr: addNullExactDateToReferenceJoins(tau.now_tr),
      updates,
    }
  }

  const formatTimeBoundUpdate = (
    bau:
      | (typeof result.now_time_update)[number]['now_bau_now_time_update_lower_buidTonow_bau']
      | (typeof result.now_time_update)[number]['now_bau_now_time_update_upper_buidTonow_bau']
  ) => {
    if (!bau) return null

    const coordinatorPerson = getPersonFromLookup(peopleLookup, bau.bau_coordinator)
    const authorizerPerson = getPersonFromLookup(peopleLookup, bau.bau_authorizer)
    const updates = timeBoundLogRows.filter((logRow: (typeof timeBoundLogRows)[number]) => logRow.buid === bau.buid)

    return {
      ...bau,
      bau_coordinator: getPersonDisplayName(coordinatorPerson, bau.bau_coordinator),
      bau_authorizer: getPersonDisplayName(authorizerPerson, bau.bau_authorizer),
      now_br: addNullExactDateToReferenceJoins(bau.now_br),
      updates,
    }
  }

  const nowTau = result.now_tau.map(formatTimeUnitUpdate)
  const nowTimeUpdate = result.now_time_update.map(update => {
    const {
      now_bau_now_time_update_lower_buidTonow_bau: lowerBoundUpdate,
      now_bau_now_time_update_upper_buidTonow_bau: upperBoundUpdate,
      ...timeUpdate
    } = update
    const coordinatorPerson = getPersonFromLookup(peopleLookup, update.coordinator)
    const authorizerPerson = getPersonFromLookup(peopleLookup, update.authorizer)

    return {
      ...timeUpdate,
      coordinator: getPersonDisplayName(coordinatorPerson, update.coordinator),
      authorizer: getPersonDisplayName(authorizerPerson, update.authorizer),
      now_tau: update.now_tau ? formatTimeUnitUpdate(update.now_tau) : null,
      lower_bound_update: formatTimeBoundUpdate(lowerBoundUpdate),
      upper_bound_update: formatTimeBoundUpdate(upperBoundUpdate),
    }
  })

  const {
    now_tau: _nowTau,
    now_time_update: _nowTimeUpdate,
    now_tu_bound_now_time_unit_low_bndTonow_tu_bound: low_bound,
    now_tu_bound_now_time_unit_up_bndTonow_tu_bound: up_bound,
    ...rest
  } = result
  return { ...rest, now_tau: nowTau, now_time_update: nowTimeUpdate, low_bound, up_bound }
}

export const getTimeUnitLocalities = async (id: string, options?: TabListQueryOptions) => {
  // TODO: Check if user has access
  const orderBy = options?.sorting.map(sort => ({
    [sort.id]: sort.desc ? 'desc' : 'asc',
  }))

  const result = await nowDb.now_loc.findMany({
    where: { OR: [{ bfa_max: id }, { bfa_min: id }] },
    orderBy,
    skip: options?.skip,
    take: options?.take,
  })
  return result
}

export const validateTimeUnitBoundReferences = (
  editedFields: EditDataType<TimeUnitDetailsType>,
  validationUpBound: TimeUnitDetailsType['up_bound'] | undefined,
  validationLowBound: TimeUnitDetailsType['low_bound'] | undefined
): ValidationObject[] => {
  const errors: ValidationObject[] = []

  if (editedFields.up_bnd !== undefined && editedFields.up_bnd !== null && !validationUpBound) {
    errors.push({
      name: 'Upper Bound',
      error: `Upper bound with ID ${editedFields.up_bnd} does not exist`,
    })
  }

  if (editedFields.low_bnd !== undefined && editedFields.low_bnd !== null && !validationLowBound) {
    errors.push({
      name: 'Lower Bound',
      error: `Lower bound with ID ${editedFields.low_bnd} does not exist`,
    })
  }

  return errors
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
