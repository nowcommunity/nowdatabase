import { OccurrenceDetailsType, Role, User } from '../../../../frontend/src/shared/types'
import { AccessError } from '../../middlewares/authorizer'
import { nowDb } from '../../utils/db'
import { ensureOccurrenceEditAccess } from '../occurrenceService'

const editableOccurrenceFields = [
  'nis',
  'pct',
  'quad',
  'mni',
  'qua',
  'id_status',
  'orig_entry',
  'source_name',
  'body_mass',
  'mesowear',
  'mw_or_high',
  'mw_or_low',
  'mw_cs_sharp',
  'mw_cs_round',
  'mw_cs_blunt',
  'mw_scale_min',
  'mw_scale_max',
  'mw_value',
  'microwear',
  'dc13_mean',
  'dc13_n',
  'dc13_max',
  'dc13_min',
  'dc13_stdev',
  'do18_mean',
  'do18_n',
  'do18_max',
  'do18_min',
  'do18_stdev',
] as const

export type EditableOccurrenceData = Partial<Pick<OccurrenceDetailsType, (typeof editableOccurrenceFields)[number]>>

type OccurrenceUpdateData = Record<string, unknown> & { body_mass?: bigint | null }

export const pickEditableOccurrenceData = (payload: EditableOccurrenceData): EditableOccurrenceData => {
  return editableOccurrenceFields.reduce<EditableOccurrenceData>((acc, fieldName) => {
    if (fieldName in payload) {
      ;(acc as Record<string, unknown>)[fieldName] = payload[fieldName]
    }
    return acc
  }, {})
}

const buildOccurrenceUpdateData = (payload: EditableOccurrenceData): OccurrenceUpdateData => {
  const pickedData = pickEditableOccurrenceData(payload)

  return Object.entries(pickedData).reduce<OccurrenceUpdateData>((acc, [field, value]) => {
    if (field === 'body_mass') {
      if (typeof value === 'number') {
        acc.body_mass = BigInt(Math.trunc(value))
      } else if (value === null) {
        acc.body_mass = null
      }
      return acc
    }

    acc[field] = value
    return acc
  }, {})
}

export const updateOccurrenceByCompositeKey = async (
  lid: number,
  speciesId: number,
  editedOccurrence: EditableOccurrenceData,
  user?: User
) => {
  if (!user || ![Role.Admin, Role.EditUnrestricted, Role.EditRestricted].includes(user.role)) {
    throw new AccessError()
  }

  await ensureOccurrenceEditAccess(lid, user)

  const existingOccurrence = await nowDb.now_ls.findUnique({
    where: {
      lid_species_id: {
        lid,
        species_id: speciesId,
      },
    },
  })

  if (!existingOccurrence) {
    return null
  }

  const updatedOccurrence = await nowDb.now_ls.update({
    where: {
      lid_species_id: {
        lid,
        species_id: speciesId,
      },
    },
    data: buildOccurrenceUpdateData(editedOccurrence),
  })

  return updatedOccurrence
}
