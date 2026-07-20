import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { pool } from '../../utils/db'

describe('POST /projects', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it('creates a project with members', async () => {
    await login('testSu', 'test')

    const result = await send<{ pid: number; contact: string; now_proj_people: Array<{ initials: string }> }>(
      'projects',
      'POST',
      {
        projectCode: 'PRJ-001',
        projectName: 'Integration Test Project',
        coordinatorUserId: 163,
        projectStatus: 'current',
        recordStatus: true,
        memberUserIds: [167],
      }
    )

    expect(result.status).toEqual(201)
    expect(result.body.contact).toEqual('TEST-SU')
    expect(result.body.now_proj_people).toEqual([{ initials: 'TEST-PL', pid: result.body.pid }])
  })

  it('returns validation error when coordinator is missing', async () => {
    await login('testSu', 'test')

    const result = await send('projects', 'POST', {
      projectCode: 'PRJ-002',
      projectName: 'Missing Coordinator',
      projectStatus: 'planned',
      recordStatus: false,
    })

    expect(result.status).toEqual(400)
  })

  it('rejects unknown member ids', async () => {
    await login('testSu', 'test')

    const result = await send('projects', 'POST', {
      projectCode: 'PRJ-003',
      projectName: 'Unknown Member',
      coordinatorUserId: 163,
      memberUserIds: [99999],
    })

    expect(result.status).toEqual(400)
  })

  it('denies non-admin users', async () => {
    const unauthorizedProject = {
      projectCode: 'PRJ-004',
      projectName: 'Unauthorized Create',
      coordinatorUserId: 163,
    }

    await login('testPl', 'test')
    const plResult = await send('projects', 'POST', unauthorizedProject)
    expect(plResult.status).toEqual(403)
    expect(plResult.body).toEqual(noPermError)

    await login('testEu', 'test')
    const euResult = await send('projects', 'POST', unauthorizedProject)
    expect(euResult.status).toEqual(403)
    expect(euResult.body).toEqual(noPermError)

    await login('testEr', 'test')
    const erResult = await send('projects', 'POST', unauthorizedProject)
    expect(erResult.status).toEqual(403)
    expect(erResult.body).toEqual(noPermError)

    logout()
    const anonResult = await send('projects', 'POST', unauthorizedProject)
    expect(anonResult.status).toEqual(403)
    expect(anonResult.body).toEqual(noPermError)
  })
})
