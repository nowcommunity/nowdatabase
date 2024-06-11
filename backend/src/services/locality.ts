import { nowDb, logDb, pool } from '../utils/db'
import { EditDataType, LocalityDetailsType } from '../../../frontend/src/backendTypes'
import Prisma from '../../prisma/generated/now_test_client'
import { validateLocality } from '../../../frontend/src/validators/locality'
import { detailedDiff } from 'deep-object-diff'
import { filterFields } from './writeUtils'
import { ValidationObject } from '../../../frontend/src/validators/validator'
import { logger } from '../utils/logger'
import { fixBigInt } from '../utils/common'

export const getAllLocalities = async (onlyPublic: boolean) => {
  const where = onlyPublic ? { loc_status: false } : {}

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
          now_lr: true,
        },
      },
    },
  })

  if (!result) return null
  const { now_ls, now_mus, now_plr, ...locality } = result
  return {
    ...locality,
    museums: now_mus.map(museum => museum.com_mlist),
    projects: now_plr.map(project => project.now_proj),
    species: now_ls.map(species => species.com_species),
  }
}

export const fixEditedLocality = (editedLocality: EditDataType<LocalityDetailsType>) => {
  if (editedLocality.now_lau) {
    editedLocality.now_lau = editedLocality.now_lau.map(lau => ({ ...lau, lau_date: new Date(lau.lau_date as Date) }))
  }
  // TODO: see if we have to turn these into bigint or if writing number to db is ok.
  // if (editedLocality.now_ls) {
  //   editedLocality.now_ls = editedLocality.now_ls.map(now_ls => ({
  //     ...now_ls,
  //     com_species: {
  //       ...now_ls.com_species,
  //       body_mass: now_ls.com_species.body_mass,
  //     },
  //   }))
  // }
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
  const difference = detailedDiff(oldLocality!, fixedEditedLocality)
  const { filteredFields, filteredObject } = filterFields(
    difference.updated as EditDataType<LocalityDetailsType>,
    nowDb.now_loc.fields as unknown as Record<string, unknown>
  )
  const validationErrors = validateEntireLocality(filteredObject)
  if (validationErrors.length > 0) return { validationErrors }
  const result = await writeLocality(oldLocality!.lid, filteredFields)
  return { result }
}

export const writeLocality = async (lid: number, filteredFields: Array<[string, unknown]>) => {
  let conn
  try {
    conn = await pool.getConnection()
    await conn.beginTransaction()

    const dbName = 'now_test'
    const logDbName = 'now_log_test'
    const tableName = 'now_loc'

    const columns = filteredFields.map(([field]) => `${field} = ?`).join(', ')
    const values = filteredFields.map(([, value]) => value)

    console.log('writing to db:')
    console.log(JSON.stringify([columns, values], null, 2))

    const oldLocalityResults = await conn.query<Prisma.now_loc[]>(
      `SELECT * FROM ${dbName}.${tableName} WHERE lid = ?`,
      [lid]
    )

    const oldLocality = oldLocalityResults[0]

    console.log('OLD LOC')
    console.log(JSON.stringify(fixBigInt(oldLocality), null, 2))

    const result = await conn.query<Prisma.now_loc>(`UPDATE ${dbName}.${tableName} SET ${columns} WHERE lid = ?`, [
      ...values,
      lid,
    ])

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
      luid: lid,
    }))

    logger.info('Writing into log...')
    for (const row of updateRows) {
      const columnsAndValues = Object.entries(row)
      const columns = columnsAndValues.map(([column]) => column)
      const values = columnsAndValues.map(([, values]) => values)
      console.log({ columns, values })
      const updateWriteResult = await conn.query<Prisma.now_loc>(
        `INSERT INTO ${logDbName}.log (${columns.join(', ')}) VALUES (${columns.map(col => '?').join(', ')})`,
        values
      )
      logger.info(JSON.stringify(fixBigInt(updateWriteResult), null, 2))
    }

    await conn.commit()
    logger.info('Wrote successfully!')
  } finally {
    if (conn) await conn.release()
  }

  logger.info('Wrote to now_loc')
  return true
}

export const editLocality = async (
  lid: number,
  filteredFields: Array<[string, unknown]>,
  filteredLoc: EditDataType<Prisma.now_loc>
) => {
  const result = await nowDb.now_loc.update({
    where: {
      lid,
    },
    data: {
      ...(filteredLoc as Prisma.now_loc),
    },
  })

  // log_action: 1=delete, 2=create, 3=update
  const data = filteredFields.map(([field, value]) => ({
    event_time: new Date(),
    user_name: 'testuser',
    server_name: 'sysbiol',
    table_name: 'now_loc',
    pk_data: `${(lid + '').length}.${lid};`,
    column_name: field,
    new_data: value as never,
    luid: lid,
  }))

  await logDb.log.createMany({ data })

  return result
}
