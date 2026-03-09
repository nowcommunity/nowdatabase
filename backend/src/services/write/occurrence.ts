import {
  EditMetaData,
  EditableOccurrenceData,
  OccurrenceEditableField,
  Reference,
  Role,
  User,
} from '../../../../frontend/src/shared/types'
import { AccessError } from '../../middlewares/authorizer'
import { getFieldsOfTables, nowDb } from '../../utils/db'
import { NOW_DB_NAME } from '../../utils/config'
import { ensureOccurrenceEditAccess, validateOccurrencePayload } from '../occurrenceService'
import { WriteHandler } from './writeOperations/writeHandler'

const editableOccurrenceFields: OccurrenceEditableField[] = [
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
]

type OccurrenceUpdateData = Record<string, unknown> & { body_mass?: bigint | null; lid: number; species_id: number }

const getOccurrenceWriteHandler = () => {
  return new WriteHandler({
    dbName: NOW_DB_NAME,
    table: 'now_loc',
    idColumn: 'lid',
    allowedColumns: getFieldsOfTables(['now_ls', 'now_lau', 'now_lr']),
    type: 'update',
  })
}

export const pickEditableOccurrenceData = (payload: EditableOccurrenceData): EditableOccurrenceData => {
  return editableOccurrenceFields.reduce<EditableOccurrenceData>((acc, fieldName) => {
    if (fieldName in payload) {
      ;(acc as Record<string, unknown>)[fieldName] = payload[fieldName]
    }
    return acc
  }, {})
}

const buildOccurrenceUpdateData = (
  lid: number,
  speciesId: number,
  payload: EditableOccurrenceData
): OccurrenceUpdateData => {
  const pickedData = pickEditableOccurrenceData(payload)

  return Object.entries(pickedData).reduce<OccurrenceUpdateData>(
    (acc, [field, value]) => {
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
    },
    { lid, species_id: speciesId }
  )
}

export const updateOccurrenceByCompositeKey = async (
  lid: number,
  speciesId: number,
  editedOccurrence: EditableOccurrenceData & EditMetaData,
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

  const { comment, references, ...editablePayload } = editedOccurrence
  validateOccurrencePayload(editablePayload)

  const writeHandler = getOccurrenceWriteHandler()

  try {
    await writeHandler.start()
    writeHandler.idValue = lid

    await writeHandler.updateObject('now_ls', buildOccurrenceUpdateData(lid, speciesId, editablePayload), [
      'lid',
      'species_id',
    ])

    await writeHandler.logUpdatesAndComplete(user.initials, comment ?? '', (references ?? []) as Reference[])
  } catch (error) {
    await writeHandler.end()
    throw error
  }

  return await nowDb.now_ls.findUnique({
    where: {
      lid_species_id: {
        lid,
        species_id: speciesId,
      },
    },
  })
}
