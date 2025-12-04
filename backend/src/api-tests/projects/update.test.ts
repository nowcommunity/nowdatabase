import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { login, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { pool } from '../../utils/db'

describe('PUT /projects/:id', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it('updates coordinator and members', async () => {
    await login('testSu', 'test')

    const createResult = await send<{ pid: number }>('projects', 'POST', {
      projectCode: 'PRJ-UPDATE',
      projectName: 'Project To Update',
      coordinatorUserId: 163,
      memberUserIds: [167],
    })

    const result = await send<{
      pid: number
      contact: string
      now_proj_people: Array<{ initials: string; pid: number }>
      proj_name: string
      proj_code: string
    }>(`projects/${createResult.body.pid}`, 'PUT', {
      projectCode: 'PRJ-UPDATED',
      projectName: 'Updated Project',
      coordinatorUserId: 167,
      memberUserIds: [163],
    })

    expect(result.status).toEqual(200)
    expect(result.body.contact).toEqual('TEST-PL')
    expect(result.body.proj_code).toEqual('PRJ-UPDATED')
    expect(result.body.proj_name).toEqual('Updated Project')
    expect(result.body.now_proj_people).toEqual([{ initials: 'TEST-SU', pid: result.body.pid }])
  })

  it('returns validation error for invalid members', async () => {
    await login('testSu', 'test')

    const createResult = await send<{ pid: number }>('projects', 'POST', {
      projectCode: 'PRJ-INVALID',
      projectName: 'Project Invalid Members',
      coordinatorUserId: 163,
    })

    const result = await send(`projects/${createResult.body.pid}`, 'PUT', {
      memberUserIds: ['not-a-number'],
    })

    expect(result.status).toEqual(400)
  })

  it('denies non-admin users', async () => {
    await login('testPl', 'test')

    const result = await send('projects/1', 'PUT', {
      projectName: 'Unauthorized Update',
    })

    expect(result.status).toEqual(403)
  })
})
