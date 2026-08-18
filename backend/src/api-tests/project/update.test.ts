import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals'
import { login, logout, noPermError, resetDatabase, send } from '../utils'
import { pool } from '../../utils/db'
import {
  editedProject,
  existingPerson,
  existingPerson2,
  invalidMemberArrayError1,
  invalidMemberArrayError2,
  newProjectBasis,
} from './data'
import { ProjectDetailsType } from '../../../../frontend/src/shared/types'
import { ValidationError } from 'express-validator'

let existingProject: ProjectDetailsType | null = null

describe('Updating project works', () => {
  beforeAll(async () => {
    await resetDatabase()
    await login()
    const { body, status: getReqStat } = await send<ProjectDetailsType>('project/3', 'GET')
    expect(getReqStat).toEqual(200)
    existingProject = body
  })
  beforeEach(async () => {
    await login()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('Request succeeds and returns valid number id', async () => {
    const { body: resultBody, status: updateStatus } = await send<{ pid: number }>('projects/', 'PUT', {
      project: editedProject,
    })
    const { pid: updatedId } = resultBody

    expect(typeof updatedId).toEqual('number')
    expect(updateStatus).toEqual(200)

    const { body, status: getReqStat } = await send<ProjectDetailsType>(`project/${updatedId}`, 'GET')
    expect(getReqStat).toEqual(200)
    existingProject = body
  })

  it('Contains correct data', () => {
    const { proj_code, proj_name } = existingProject!
    expect(proj_code).toEqual(editedProject.proj_code)
    expect(proj_name).toEqual(editedProject.proj_name)
  })

  it('Updating fails with empty project code', async () => {
    const { body: resultBody, status: getReqStatus } = await send('projects/', 'PUT', {
      project: { ...editedProject, proj_code: '' },
    })
    expect(getReqStatus).toEqual(403)
    expect(resultBody.length).toEqual(1) //There should be 1 validation error
  })

  it('Updating fails for non-admin users', async () => {
    await login('testEr')
    const { body: resultBodyEr, status: resultStatusEr } = await send<{ pid: number }>('projects/', 'PUT', {
      project: { ...editedProject, proj_code: 'CODE2' },
    })
    expect(resultBodyEr).toEqual(noPermError)
    expect(resultStatusEr).toEqual(403)

    await login('testEu')
    const { body: resultBodyEu, status: resultStatusEu } = await send<{ pid: number }>('projects/', 'PUT', {
      project: { ...editedProject, proj_code: 'CODE3' },
    })
    expect(resultBodyEu).toEqual(noPermError)
    expect(resultStatusEu).toEqual(403)

    logout()
    const { body: resultBodyAnon, status: resultStatusAnon } = await send('projects/', 'PUT', {
      project: { ...editedProject, proj_code: 'CODE4' },
    })
    expect(resultBodyAnon).toEqual(noPermError)
    expect(resultStatusAnon).toEqual(403)
  })

  it('Adding members works', async () => {
    const { status: putResultStatus } = await send<ProjectDetailsType>('projects/', 'PUT', {
      project: {
        ...editedProject,
        now_proj_people: [
          ...existingProject!.now_proj_people,
          { initials: existingPerson2.initials, pid: 3, com_people: existingPerson2 },
        ],
      },
    })
    expect(putResultStatus).toEqual(200)

    const { body: getResultBody, status: getResultStatus } = await send<ProjectDetailsType>('project/3', 'GET')
    expect(getResultStatus).toEqual(200)
    expect(getResultBody.now_proj_people).toHaveLength(2)
    expect(getResultBody.now_proj_people[0].initials).toEqual(existingPerson.initials)
    expect(getResultBody.now_proj_people[1].initials).toEqual(existingPerson2.initials)
    existingProject = getResultBody
  })

  it('Removing members works', async () => {
    expect(existingProject!.now_proj_people).toHaveLength(2) // set in previous test
    const { status: putResultStatus } = await send<ProjectDetailsType>('projects/', 'PUT', {
      project: { ...editedProject, now_proj_people: newProjectBasis.now_proj_people },
    })
    expect(putResultStatus).toEqual(200)

    const { body: getResultBody, status: getResultStatus } = await send<ProjectDetailsType>('project/3', 'GET')
    expect(getResultStatus).toEqual(200)
    expect(getResultBody.now_proj_people).toHaveLength(1)
    expect(getResultBody.now_proj_people[0].initials).toEqual(existingPerson.initials)

    const { status: putResultStatus2 } = await send<ProjectDetailsType>('projects/', 'PUT', {
      project: { ...editedProject, now_proj_people: [] },
    })
    expect(putResultStatus2).toEqual(200)

    const { body: getResultBody2, status: getResultStatus2 } = await send<ProjectDetailsType>('project/3', 'GET')
    expect(getResultStatus2).toEqual(200)
    expect(getResultBody2.now_proj_people).toEqual([])
  })

  it('Adding members without required fields does not work', async () => {
    const { body: putResultBody, status: putResultStatus } = await send('projects/', 'PUT', {
      project: {
        ...editedProject,
        now_proj_people: [{ initials: existingPerson2.initials }],
      },
    })
    expect(putResultStatus).toEqual(403)
    expect(putResultBody).toHaveLength(1)
    expect((putResultBody as Array<ValidationError>)[0]).toEqual(invalidMemberArrayError1)

    const { body: putResultBody2, status: putResultStatus2 } = await send('projects/', 'PUT', {
      project: {
        ...editedProject,
        now_proj_people: [{ com_people: existingPerson2 }],
      },
    })
    expect(putResultStatus2).toEqual(403)
    expect(putResultBody2).toHaveLength(1)
    expect((putResultBody2 as Array<ValidationError>)[0]).toEqual(invalidMemberArrayError2)
  })
})
