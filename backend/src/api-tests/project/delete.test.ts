import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import { pool } from '../../utils/db'
import { ProjectDetailsType } from '../../../../frontend/src/shared/types'

describe('Deleting project works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)

  beforeEach(async () => {
    await login()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('allows admins to delete a project and related data', async () => {
    const { body: existingProject, status: getReqStatus } = await send<ProjectDetailsType>('project/14', 'GET')
    expect(getReqStatus).toEqual(200)
    expect(existingProject.pid).toEqual(14)

    const deleted = await send(`project/${existingProject.pid}`, 'DELETE')
    expect(deleted.status).toEqual(200)

    const fetchAfterDelete = await send(`project/${existingProject.pid}`, 'GET')
    expect(fetchAfterDelete.status).toEqual(404)
  })

  it('project members are not deleted along with the project', async () => {
    const { body: existingProject, status: getReqStatus } = await send<ProjectDetailsType>('project/3', 'GET')
    expect(getReqStatus).toEqual(200)
    expect(existingProject.pid).toEqual(3)
    expect(existingProject.now_proj_people[0]).toHaveProperty('com_people')

    await login('testSu', 'test')
    const deleted = await send(`project/${existingProject.pid}`, 'DELETE')
    expect(deleted.status).toEqual(200)

    const memberFetchAfterDelete = await send(
      `person/${existingProject.now_proj_people[0].com_people!.initials}`,
      'GET'
    )
    expect(memberFetchAfterDelete.status).toEqual(200)
  })

  it('rejects deletion attempts from non-admin users', async () => {
    const { body: existingProject, status: getReqStatus } = await send<ProjectDetailsType>('project/23', 'GET')
    expect(getReqStatus).toEqual(200)
    expect(existingProject.pid).toEqual(23)

    await login('testEu', 'test')
    const euDeleteAttempt = await send(`project/${existingProject.pid}`, 'DELETE')
    expect(euDeleteAttempt.status).toEqual(403)
    expect(euDeleteAttempt.body).toEqual(noPermError)

    await login('testEr', 'test')
    const erDeleteAttempt = await send(`project/${existingProject.pid}`, 'DELETE')
    expect(erDeleteAttempt.status).toEqual(403)
    expect(erDeleteAttempt.body).toEqual(noPermError)

    logout()
    const anonDeleteAttempt = await send(`project/${existingProject.pid}`, 'DELETE')
    expect(anonDeleteAttempt.status).toEqual(403)
    expect(anonDeleteAttempt.body).toEqual(noPermError)

    await login('testSu', 'test')
    const { body: afterAttemptsBody, status: afterAttemptsStatus } = await send<ProjectDetailsType>(
      `project/${existingProject.pid}`,
      'GET'
    )
    expect(afterAttemptsStatus).toEqual(200)
    expect(afterAttemptsBody.pid).toEqual(existingProject.pid)
  })
})
