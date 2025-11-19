import { afterAll, beforeEach, describe, expect, it } from '@jest/globals'
import { LocalityDetailsType } from '../../../../frontend/src/shared/types'
import { editedLocality } from './data'
import { login, resetDatabase, resetDatabaseTimeout, send, noPermError } from '../utils'
import { pool } from '../../utils/db'

const TEST_PROJECT_ID = 35
const localityId = editedLocality.lid

const cloneEditedLocality = () => structuredClone(editedLocality)

const buildLocalityPayload = (projectIds: number[]) => {
  const payload = cloneEditedLocality()
  payload.now_plr = projectIds.map(pid => ({
    lid: payload.lid,
    pid,
    rowState: 'new' as const,
  }))
  return payload
}

describe('Locality project links', () => {
  beforeEach(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it('adds a project to a locality and exposes it via the API', async () => {
    await login()
    const payload = buildLocalityPayload([TEST_PROJECT_ID])

    const result = await send<{ id: number }>('locality', 'PUT', { locality: payload })
    expect(result.status).toEqual(200)
    expect(result.body.id).toEqual(localityId)

    const localityResponse = await send<LocalityDetailsType>(`locality/${localityId}`, 'GET')
    expect(localityResponse.status).toEqual(200)
    expect(localityResponse.body.now_plr.some(link => link.pid === TEST_PROJECT_ID)).toEqual(true)
  })

  it('rejects users without project edit permissions', async () => {
    await login('testEr')
    const payload = buildLocalityPayload([TEST_PROJECT_ID])

    const result = await send('locality', 'PUT', { locality: payload })
    expect(result.status).toEqual(403)
    expect(result.body).toEqual(noPermError)
  })

  it('ignores duplicate additions of the same project', async () => {
    await login()
    const duplicatePayload = buildLocalityPayload([TEST_PROJECT_ID, TEST_PROJECT_ID])

    const firstResult = await send<{ id: number }>('locality', 'PUT', { locality: duplicatePayload })
    expect(firstResult.status).toEqual(200)

    const duplicateAttempt = buildLocalityPayload([TEST_PROJECT_ID])
    const secondResult = await send<{ id: number }>('locality', 'PUT', { locality: duplicateAttempt })
    expect(secondResult.status).toEqual(200)

    const localityResponse = await send<LocalityDetailsType>(`locality/${localityId}`, 'GET')
    const matchingLinks = localityResponse.body.now_plr.filter(link => link.pid === TEST_PROJECT_ID)
    expect(matchingLinks).toHaveLength(1)
  })
})
