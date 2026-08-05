import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { login, logout, noPermError, resetDatabase, send } from '../utils'
import { pool } from '../../utils/db'
import { editedProject } from './data'
import { ProjectDetailsType } from '../../../../frontend/src/shared/types'

let existingProject: ProjectDetailsType | null = null

describe('Updating project works', () => {
  beforeAll(async () => {
    await resetDatabase()
    await login()
    const { body, status: getReqStat } = await send<ProjectDetailsType>('project/3', 'GET')
    expect(getReqStat).toEqual(200)
    existingProject = body
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

  it('Updating succeeds fails for non-admin users', async () => {
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

  it.todo("Adding members works")
  it.todo("Removing members works")
})
