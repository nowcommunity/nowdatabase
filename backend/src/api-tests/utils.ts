import assert from 'node:assert/strict'
import { UpdateLog } from '../../../frontend/src/backendTypes'
import { LogRow } from '../services/writeOperations/types'

let token: string | null = null
const baseUrl = 'http://localhost:4000'

export const send = async <T extends Record<string, unknown>>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: object
) => {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  if (token) headers.append('authorization', `bearer ${token}`)
  const options = { body: method !== 'GET' ? JSON.stringify(body) : undefined, method, headers }
  const response = await fetch(`${baseUrl}/${path}`, options)
  const responseText = await response.text()
  if (!responseText) return { body: {} as T, status: response.status }
  return { body: JSON.parse(responseText) as T, status: response.status }
}

export const setToken = (newToken: string) => (token = newToken)

export const login = async () => {
  // Make sure test users exist
  await send('test/create-test-users', 'GET')
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
    assert(!!receivedRow, 'Did not find relevant log row')
    const debugLog = `Row: \n${JSON.stringify(receivedRow, null, 2)}\nExpected:\n${JSON.stringify(expectedRow)}`
    assert(receivedRow.new_data === expectedRow.value, `Log rows new data differs. ${debugLog}`)
    assert(receivedRow.old_data === expectedRow.oldValue, `Log rows old data differs. ${debugLog}`)
    assert(
      actionTypeToString[receivedRow.log_action!] === expectedRow.type,
      `Log rows action type differs. ${debugLog}`
    )
  }
  assert(logRows.length === expectedAmount, 'Wrong amount of log rows in relevant update')
}
