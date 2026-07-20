import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
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
    const plDeleteAttempt = await send(`project/${createdProject.body.pid}`, 'DELETE')
    expect(plDeleteAttempt.status).toEqual(403)
    expect(plDeleteAttempt.body).toEqual(noPermError)

    await login('testEu', 'test')
    const euDeleteAttempt = await send(`project/${createdProject.body.pid}`, 'DELETE')
    expect(euDeleteAttempt.status).toEqual(403)
    expect(euDeleteAttempt.body).toEqual(noPermError)

    await login('testEr', 'test')
    const erDeleteAttempt = await send(`project/${createdProject.body.pid}`, 'DELETE')
    expect(erDeleteAttempt.status).toEqual(403)
    expect(erDeleteAttempt.body).toEqual(noPermError)

    logout()
    const anonDeleteAttempt = await send(`project/${createdProject.body.pid}`, 'DELETE')
    expect(anonDeleteAttempt.status).toEqual(403)
    expect(anonDeleteAttempt.body).toEqual(noPermError)

    await login('testSu', 'test')
    const fetchAfterAttempts = await send(`project/${createdProject.body.pid}`, 'GET')
    expect(fetchAfterAttempts.status).toEqual(200)
    expect(fetchAfterAttempts.body).toHaveProperty('pid', createdProject.body.pid)
  })
})
