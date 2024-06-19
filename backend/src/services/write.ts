/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  EditDataType,
  LocalityDetailsType,
  SpeciesDetailsType,
  TimeBoundDetailsType,
  TimeUnitDetailsType,
} from '../../../frontend/src/backendTypes'
import { diff } from 'deep-object-diff'
import { getLocalityDetails } from './locality'
type WriteFunction = (
  data: EditDataType<LocalityDetailsType | SpeciesDetailsType | TimeUnitDetailsType | TimeBoundDetailsType>,
  tableName: string,
  oldObject: EditDataType<LocalityDetailsType | SpeciesDetailsType | TimeUnitDetailsType | TimeBoundDetailsType>
) => string

export const write: WriteFunction = (data, tableName, oldObject) => {
  console.log('write')
  const deletedRows: any[] = []
  const writtenFields: any[] = []

  const writeTable = (data: object, tableName: string, oldObject: object, parentTable?: string) => {
    console.log('writeTable')
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const result = writeTable(data, tableName, oldObject[i] as object, parentTable)
        writtenFields.push(result)
      }
      return
    }
    const fieldsToWrite: any[] = []
    for (const field of Object.keys(data)) {
      const value = data[field] as string | number
      if (value === undefined) {
        const id = ids[tableName]
        const deleteResult = query(`DELETE FROM ${tableName} WHERE ${id} = ?`, [data[id]])
        deletedRows.push({ tableName, id })
        // Todo DATE here too probably:
      } else if (typeof value === 'string' || typeof value === 'number') {
        fieldsToWrite.push({ field, value: data[field] })
      }
    }

    const columns = fieldsToWrite.map(({ field }) => field)
    const values = fieldsToWrite.map(({ value }) => value)

    const oldId = oldObject[ids[tableName]]

    const result =
      oldId === undefined
        ? query(`INSERT INTO ${tableName} VALUES ? RETURNING ${ids[tableName]}`, values)
        : query(`UPDATE ${tableName} (?) VALUES (?) RETURNING ${ids[tableName]}`, [...columns, ...values])

    return { id: result[ids[tableName]] }
  }
  writeTable(diff(data, oldObject), tableName, oldObject)
  return 'ok'
}

const ids = { now_loc: 'lid', now_ls: ['lid', 'species_id'] }

const query = (queryString: string, values: unknown[]) => {
  console.log(queryString)
  console.log('values: ', values)
  return 'ok'
}

const testLoc: EditDataType<LocalityDetailsType> = {
  age_comm: 'testi',
}

export const testWrite = async () => {
  const testOldLoc = await getLocalityDetails(10010)
  write(testLoc, 'now_loc', testOldLoc as LocalityDetailsType)
}
