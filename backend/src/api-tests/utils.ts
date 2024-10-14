import request from 'supertest'
import app from '../app'
import { expect } from '@jest/globals'
import { UpdateLog } from '../../../frontend/src/backendTypes'
import { LogRow } from '../services/write/writeOperations/types'

let token: string | null = null

export const send = async <T extends Record<string, unknown>>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: object
) => {
  let response = null
  path = '/' + path

  switch (method) {
    case 'GET':
      response = await request(app)
        .get(path)
        .set('Content-Type', 'application/json')
        .set('authorization', `bearer ${token ?? ''}`)

      // TODO remove this when fixBigInt is refactored. Also lint-ignore is then not needed
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      response.body = response.text ? JSON.parse(response.text) : response.body
      break

    case 'POST':
      response = await request(app)
        .post(path)
        .send(body)
        .set('Content-Type', 'application/json')
        .set('authorization', `bearer ${token ?? ''}`)
      break

    case 'PUT':
      response = await request(app)
        .put(path)
        .send(body)
        .set('Content-Type', 'application/json')
        .set('authorization', `bearer ${token ?? ''}`)
      break

    case 'DELETE':
      response = await request(app)
        .delete(path)
        .send(body)
        .set('Content-Type', 'application/json')
        .set('authorization', `bearer ${token ?? ''}`)
      break
  }

  if (response.status >= 400) return { body: {} as T, status: response.status }
  return { body: response.body as unknown as T, status: response.status }
}

export const setToken = (newToken: string) => (token = newToken)

export const login = async () => {
  // Login and set token
  const result = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
  token = result.body.token
}

export const actionTypeToString = {
  1: 'delete',
  2: 'add',
  3: 'update',
} as Record<number, string>

export const testLogRows = (logRows: UpdateLog[], expectedLogRows: Partial<LogRow>[], expectedAmount: number) => {
  for (const expectedRow of expectedLogRows) {
    const receivedRow = logRows.find(
      row =>
        row.column_name === expectedRow.column &&
        row.table_name === expectedRow.table &&
        row.old_data === expectedRow.oldValue &&
        row.new_data === expectedRow.value
    )

    expect(!!receivedRow).toEqual(true) //`Did not find this expected logrow: ${JSON.stringify(expectedRow)}`)
    if (!receivedRow) throw new Error(`Did not find this expected logrow: ${JSON.stringify(expectedRow)}`)
    // const debugLog = `Row: \n${JSON.stringify(receivedRow, null, 2)}\nExpected:\n${JSON.stringify(expectedRow)}`
    expect(receivedRow.new_data).toEqual(expectedRow.value) // `Log rows new data differs. ${debugLog}`)
    expect(receivedRow.old_data).toEqual(expectedRow.oldValue) // `Log rows old data differs. ${debugLog}`)
    expect(actionTypeToString[receivedRow.log_action!]).toEqual(expectedRow.type) // `Log rows action type differs. ${debugLog}`
  }
  expect(logRows.length).toEqual(expectedAmount) // 'Wrong amount of log rows in relevant update')
}

export const resetDatabase = async () => {
  await send('test/reset-test-database', 'GET')
}

export const resetDatabaseTimeout: number = 20000
