import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { login, resetDatabase, resetDatabaseTimeout, send } from '../utils'
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
    await login('testPl', 'test')

    const result = await send('projects', 'POST', {
      projectCode: 'PRJ-004',
      projectName: 'Unauthorized Create',
      coordinatorUserId: 163,
    })

    expect(result.status).toEqual(403)
  })
})
