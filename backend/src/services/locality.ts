import { logDb, nowDb, pool } from '../utils/db'
import { EditDataType, LocalityDetailsType } from '../../../frontend/src/backendTypes'
import Prisma from '../../prisma/generated/now_test_client'
import { validateLocality } from '../../../frontend/src/validators/locality'
import { diff } from 'deep-object-diff'
import { filterFields } from './writeUtils'
import { ValidationObject } from '../../../frontend/src/validators/validator'
import { logger } from '../utils/logger'
import { fixBigInt } from '../utils/common'
import { testWrite } from './write'

export const getAllLocalities = async (onlyPublic: boolean) => {
  const where = onlyPublic ? { loc_status: false } : {}
  await testWrite()
  const result = await nowDb.now_loc.findMany({
    select: {
      lid: true,
      loc_name: true,
      bfa_max: true,
      bfa_min: true,
      max_age: true,
      min_age: true,
      country: true,
      loc_status: true,
    },
    where,
  })
  return result
}

export const getLocalityDetails = async (id: number) => {
  // TODO: Check if user has access

  const result = await nowDb.now_loc.findUnique({
    where: { lid: id },
    include: {
      now_mus: {
        include: {
          com_mlist: true,
        },
      },
      now_ls: {
        include: {
          com_species: true,
        },
      },
      now_syn_loc: {},
      now_ss: {},
      now_coll_meth: {},
      now_plr: {
        include: {
          now_proj: true,
        },
      },
      now_lau: {
        include: {
          now_lr: {
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

  const luids = result.now_lau.map(lau => lau.luid)

  const logResult = await logDb.log.findMany({ where: { luid: { in: luids } } })

  result.now_lau = result.now_lau.map(lau => ({
    ...lau,
    updates: logResult.filter(logRow => logRow.luid === lau.luid),
  }))
  if (!result) return null
  const { now_ls, now_mus, now_plr, ...locality } = result
  const localityDetails = {
    ...locality,
    museums: now_mus.map(museum => museum.com_mlist),
    projects: now_plr.map(project => project.now_proj),
    species: now_ls.map(species => species.com_species),
  }
  return JSON.parse(fixBigInt(localityDetails)!) as LocalityDetailsType
}

export const fixEditedLocality = (editedLocality: EditDataType<LocalityDetailsType>) => {
  if (editedLocality.now_lau) {
    //editedLocality.now_lau = editedLocality.now_lau.map(lau => ({ ...lau, lau_date: new Date(lau.lau_date as Date) }))
  }
  return editedLocality
}

export const validateEntireLocality = (editedFields: EditDataType<Prisma.now_loc>) => {
  const keys = Object.keys(editedFields)
  const errors: ValidationObject[] = []
  for (const key of keys) {
    const error = validateLocality(editedFields as EditDataType<LocalityDetailsType>, key as keyof LocalityDetailsType)
    if (error.error) errors.push(error)
  }
  return errors
}

export const processLocalityForEdit = async (editedLocality: EditDataType<LocalityDetailsType>) => {
  const fixedEditedLocality = fixEditedLocality(editedLocality)
  const oldLocality = await getLocalityDetails(fixedEditedLocality.lid!)
  const difference = diff(oldLocality!, fixedEditedLocality)

  const { filteredFields, filteredObject } = filterFields(
    difference as EditDataType<LocalityDetailsType>,
    nowDb.now_loc.fields as unknown as Record<string, unknown>
  )
  const validationErrors = validateEntireLocality(filteredObject)
  if (validationErrors.length > 0) return { validationErrors }
  const result = await writeLocality(oldLocality!.lid, filteredFields)
  return { result }
}

export const writeLocality = async (lid: number, filteredFields: Array<[string, unknown]>) => {
  let conn
  logger.info('starting to write')
  let result = null
  try {
    conn = await pool.getConnection()
    await conn.beginTransaction()

    const dbName = 'now_test'
    const logDbName = 'now_log_test'
    const tableName = 'now_loc'

    const columns = filteredFields.map(([field]) => `${field} = ?`).join(', ')
    const values = filteredFields.map(([, value]) => value)
    if (values.length === 0) throw new Error('No changes found')
    const oldLocalityResults = await conn.query<Prisma.now_loc[]>(
      `SELECT * FROM ${dbName}.${tableName} WHERE lid = ?`,
      [lid]
    )

    const oldLocality = oldLocalityResults[0]

    logger.info(`Updating ${columns.length} values in table ${tableName}...`)

    result = await conn.query<Prisma.now_loc>(`UPDATE ${dbName}.${tableName} SET ${columns} WHERE lid = ?`, [
      ...values,
      lid,
    ])
    // eslint-disable-next-line no-constant-condition
    if (1 + 1 === 2) throw Error('DB-writing disabled for now')
    const lauResult = await conn.query<Prisma.now_lau>(
      `INSERT INTO ${dbName}.now_lau (lau_coordinator, lau_authorizer, lid) VALUES (?, ?, ?) RETURNING now_lau.luid`,
      ['AK', 'AB', 10010]
    )

    const luid = lauResult.luid

    const updateRows = filteredFields.map(([field, value]) => ({
      event_time: new Date(),
      user_name: 'testuser', // TODO fix
      server_name: 'sysbiol',
      table_name: tableName,
      pk_data: `${(lid + '').length}.${lid};`,
      column_name: field,
      log_action: 3, // 1 = delete, 2 = create, 3 = update
      old_data: oldLocality[field as keyof Prisma.now_loc],
      new_data: value as never,
      luid,
    }))

    logger.info(`Writing ${updateRows.length} rows into log-table...`)

    for (const row of updateRows) {
      const columnsAndValues = Object.entries(row)
      const columns = columnsAndValues.map(([column]) => column)
      const values = columnsAndValues.map(([, values]) => values)
      await conn.query<Prisma.now_loc>(
        `INSERT INTO ${logDbName}.log (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
        values
      )
    }
    await conn.commit()
    logger.info('Wrote successfully!')
  } finally {
    if (conn) await conn.release()
  }
  return result
}
