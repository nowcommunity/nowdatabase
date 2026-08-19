import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { ProjectDetailsType } from '../../../../frontend/src/shared/types'
import { pool } from '../../utils/db'
import { login, logout, noPermError, resetDatabase, resetDatabaseTimeout, send } from '../utils'
import {
  existingPerson,
  invalidMemberArrayError1,
  invalidMemberArrayError2,
  newProjectBasis,
  newProjectBasisWithoutCoordinator,
  newProjectBasisWithoutMemberArray,
  noCoordinatorError,
  noMemberArrayError,
} from './data'

let createdProject: ProjectDetailsType | null = null

describe('Creating new project works', () => {
  beforeAll(async () => {
    await resetDatabase()
  }, resetDatabaseTimeout)
  beforeEach(async () => {
    await login()
  })
  afterAll(async () => {
    await pool.end()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody, status: getReqStatus } = await send<{ pid: number }>('project/', 'PUT', {
      project: newProjectBasis,
    })
    const { pid: createdId } = resultBody

    expect(typeof createdId).toEqual('number')
    expect(getReqStatus).toEqual(200)

    const { body, status: getReqStat } = await send<ProjectDetailsType>(`project/${createdId}`, 'GET')
    expect(getReqStat).toEqual(200)
    createdProject = body
  })

  it('Contains correct data', () => {
    const { pid, proj_name, proj_code, proj_status, proj_records } = createdProject!
    expect(pid).toBeDefined()
    expect(proj_name).toEqual(newProjectBasis.proj_name)
    expect(proj_code).toEqual(newProjectBasis.proj_code)
    expect(proj_status).toEqual(newProjectBasis.proj_status)
    expect(proj_records).toEqual(newProjectBasis.proj_records)
  })

  it('Creation succeeds with empty member list', async () => {
    const { status: getReqStatus } = await send<{ pid: number }>('project/', 'PUT', {
      project: { ...newProjectBasis, now_proj_people: [] },
    })

    expect(getReqStatus).toEqual(200)
  })

  it('Creation fails with no member list', async () => {
    const { body: resultBody, status: getReqStatus } = await send('project/', 'PUT', {
      project: { ...newProjectBasisWithoutMemberArray },
    })

    //expect(typeof resultBody).toBe('array')
    expect(resultBody).toContainEqual(noMemberArrayError)
    expect(getReqStatus).toEqual(403)
  })

  it('Creation succeeds with empty member list', async () => {
    const { status: getReqStatus } = await send<{ pid: number }>('project/', 'PUT', {
      project: { ...newProjectBasis, now_proj_people: [] },
    })

    expect(getReqStatus).toEqual(200)
  })

  it('Creation fails with no coordinator', async () => {
    const { body: resultBody, status: getReqStatus } = await send<{ pid: number }>('project/', 'PUT', {
      project: { ...newProjectBasisWithoutCoordinator },
    })

    //expect(typeof resultBody).toBe('array')
    expect(resultBody).toContainEqual(noCoordinatorError)
    expect(getReqStatus).toEqual(403)
  })

  it('Creation fails with coordinator that does not have a matching user', async () => {
    const { status: getReqStatus } = await send<{ pid: number }>('project/', 'PUT', {
      project: { ...newProjectBasis, contact: 'NOTEXIST' },
    })

    expect(getReqStatus).toEqual(500)
  })

  it('Creation fails for non-admin users', async () => {
    logout()
    const { body: resultBodyAnon, status: resultStatusAnon } = await send<{ pid: number }>('project/', 'PUT', {
      project: newProjectBasis,
    })
    expect(resultBodyAnon).toEqual(noPermError)
    expect(resultStatusAnon).toEqual(403)

    await login('testEr')
    const { body: resultBodyEr, status: resultStatusEr } = await send<{ pid: number }>('project/', 'PUT', {
      project: newProjectBasis,
    })
    expect(resultBodyEr).toEqual(noPermError)
    expect(resultStatusEr).toEqual(403)

    await login('testEu')
    const { body: resultBodyEu, status: resultStatusEu } = await send<{ pid: number }>('project/', 'PUT', {
      project: newProjectBasis,
    })
    expect(resultBodyEu).toEqual(noPermError)
    expect(resultStatusEu).toEqual(403)
  })

  it('Creation fails with members without required fields', async () => {
    const { body: putReqBody, status: putReqStatus } = await send('project/', 'PUT', {
      project: { ...newProjectBasis, now_proj_people: [{ initials: existingPerson.initials }] },
    })
    expect(putReqStatus).toEqual(403)
    expect(putReqBody).toHaveLength(1)
    expect((putReqBody as Array<object>)[0]).toEqual(invalidMemberArrayError1)

    const { body: putReqBody2, status: putReqStatus2 } = await send('project/', 'PUT', {
      project: { ...newProjectBasis, now_proj_people: [{ com_people: existingPerson }] },
    })
    expect(putReqStatus2).toEqual(403)
    expect(putReqBody2).toHaveLength(1)
    expect((putReqBody2 as Array<object>)[0]).toEqual(invalidMemberArrayError2)
  })
})
