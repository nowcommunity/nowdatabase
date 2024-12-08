import { PoolConnection } from 'mariadb'
import { User } from '../../../frontend/src/shared/types/dbTypes'
import { NOW_DB_NAME } from '../utils/config'
import { Role } from '../../../frontend/src/shared/types'
import { pool } from '../utils/db'

const getExportList = async (
  conn: PoolConnection,
  lids: number[],
  includeDrafts: boolean,
  rowHandler: (row: Record<string, unknown>) => void
) => {
  return new Promise(resolve => {
    const excludeDraftsString = includeDrafts
      ? ''
      : `AND (loc_status = 0 AND lid NOT IN (SELECT DISTINCT ${NOW_DB_NAME}.now_plr.lid FROM ${NOW_DB_NAME}.now_plr JOIN ${NOW_DB_NAME}.now_proj ON ${NOW_DB_NAME}.now_plr.pid = ${NOW_DB_NAME}.now_proj.pid WHERE ${NOW_DB_NAME}.now_proj.proj_records = 1))`
    resolve(
      conn
        .queryStream(
          `
    SELECT * FROM ${NOW_DB_NAME}.now_v_export_locsp WHERE lid IN (${lids.map(() => '?').join(', ')}) ${excludeDraftsString} ORDER BY loc_name
    `,
          [...lids]
        )
        .on('data', rowHandler)
    )
  })
}

const formatValue = (val: unknown) => {
  if (typeof val === 'bigint') return `"${Number(val)}"`
  if (val === null) return `""`
  return `"${val as string}"`
}

export const getLocalitySpeciesList = async (lids: number[], user: User | undefined) => {
  const exportList: unknown[] = []

  const transformRow = (row: unknown) => {
    const values = Object.values(row as object)
    return values.map(value => formatValue(value))
  }

  const conn = await pool.getConnection()
  await getExportList(
    conn,
    lids,
    (user && [Role.Admin, Role.EditUnrestricted].includes(user.role)) || false,
    (row: Record<string, unknown>) => {
      if (exportList.length === 0) {
        // Push the column titles for the first row
        exportList.push(Object.keys(row))
      }
      exportList.push(transformRow(row))
    }
  )
  await conn.end()
  return exportList
}
