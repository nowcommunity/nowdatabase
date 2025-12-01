import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { login, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { pool } from '../../utils/db'

describe('DELETE /project/:id', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  afterAll(async () => {
    await pool.end()
  })

  it('allows admins to delete a project and related data', async () => {
    await login('testSu', 'test')

    const createdProject = await send<{ pid: number }>('projects', 'POST', {
      projectCode: 'DEL-001',
      projectName: 'Project To Delete',
      coordinatorUserId: 163,
      memberUserIds: [167],
    })

    const deleted = await send(`project/${createdProject.body.pid}`, 'DELETE')

    expect(deleted.status).toEqual(200)

    const fetchAfterDelete = await send(`project/${createdProject.body.pid}`, 'GET')
    expect(fetchAfterDelete.status).toEqual(404)
  })

  it('rejects deletion attempts from non-admin users', async () => {
    await login('testSu', 'test')
    const createdProject = await send<{ pid: number }>('projects', 'POST', {
      projectCode: 'DEL-002',
      projectName: 'Unauthorized Delete',
      coordinatorUserId: 163,
    })

    await login('testPl', 'test')
    const deleteAttempt = await send(`project/${createdProject.body.pid}`, 'DELETE')

    expect(deleteAttempt.status).toEqual(403)
  })
})
