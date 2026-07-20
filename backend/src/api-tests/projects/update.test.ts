import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { pool } from '../../utils/db'

describe('PUT /projects/:id', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await resetDatabase()
    await login('testSu', 'test')
  })

  afterAll(async () => {
    await pool.end()
  })

  it('updates coordinator and members', async () => {
    const createResult = await send<{ pid: number }>('projects', 'POST', {
      projectCode: 'PRJ-UPDATE',
      projectName: 'Project To Update',
      coordinatorUserId: 163,
      memberUserIds: [167],
    })
    expect(createResult.status).toEqual(201)

    const result = await send<{
      pid: number
      contact: string
      now_proj_people: Array<{ initials: string; pid: number }>
      proj_name: string
      proj_code: string
    }>(`projects/${createResult.body.pid}`, 'PUT', {
      projectCode: 'PRJ-UPD01',
      projectName: 'Updated Project',
      coordinatorUserId: 167,
      memberUserIds: [163],
    })

    expect(result.status).toEqual(200)
    expect(result.body.contact).toEqual('TEST-PL')
    expect(result.body.proj_code).toEqual('PRJ-UPD01')
    expect(result.body.proj_name).toEqual('Updated Project')
    expect(result.body.now_proj_people).toEqual([{ initials: 'TEST-SU', pid: result.body.pid }])
  })

  it('returns validation error for invalid members', async () => {
    const createResult = await send<{ pid: number }>('projects', 'POST', {
      projectCode: 'PRJ-INV1',
      projectName: 'Project Invalid Members',
      coordinatorUserId: 163,
    })
    expect(createResult.status).toEqual(201)

    const result = await send(`projects/${createResult.body.pid}`, 'PUT', {
      memberUserIds: ['not-a-number'],
    })

    expect(result.status).toEqual(400)
  })

  it('returns validation error for too-long project code', async () => {
    const createResult = await send<{ pid: number }>('projects', 'POST', {
      projectCode: 'PRJ-LONG1',
      projectName: 'Project Long Code',
      coordinatorUserId: 163,
    })
    expect(createResult.status).toEqual(201)

    const result = await send(`projects/${createResult.body.pid}`, 'PUT', {
      projectCode: 'PRJ-UPDATED',
    })

    expect(result.status).toEqual(400)
    expect(result.body).toEqual({ message: 'Project code must be at most 10 characters' })
  })

  it('denies non-admin users', async () => {
    const unauthorizedUpdate = { projectName: 'Unauthorized Update' }

    await login('testPl', 'test')
    const plResult = await send('projects/1', 'PUT', unauthorizedUpdate)
    expect(plResult.status).toEqual(403)
    expect(plResult.body).toEqual(noPermError)

    await login('testEu', 'test')
    const euResult = await send('projects/1', 'PUT', unauthorizedUpdate)
    expect(euResult.status).toEqual(403)
    expect(euResult.body).toEqual(noPermError)

    await login('testEr', 'test')
    const erResult = await send('projects/1', 'PUT', unauthorizedUpdate)
    expect(erResult.status).toEqual(403)
    expect(erResult.body).toEqual(noPermError)

    logout()
    const anonResult = await send('projects/1', 'PUT', unauthorizedUpdate)
    expect(anonResult.status).toEqual(403)
    expect(anonResult.body).toEqual(noPermError)
  })
})
