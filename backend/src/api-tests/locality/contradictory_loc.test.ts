import { beforeEach, describe, it, expect } from '@jest/globals'
import { LocalityDetailsType } from '../../../../frontend/src/backendTypes'
import { editedLocality, newLocalityBasis } from './data'
import { login, send } from '../utils'

describe('Min and max age checks work', () => {
  beforeEach(async () => {
    await login()
  })

  it('Creating a locality with contradictory min and max ages does not work', async () => {
    const locality = newLocalityBasis
    locality.min_age = 10
    locality.max_age = 9
    const { status: putReqStatus } = await send<{ id: number }>('locality', 'PUT', {
      locality: locality,
    })

    expect(putReqStatus).toEqual(400)

    const { body: getReqBody, status: getReqStatus } = await send<LocalityDetailsType>(`locality/all`, 'GET')
    expect(getReqStatus).toEqual(200)
    expect(getReqBody).not.toContain(newLocalityBasis)
  })

  //it('Editing a locality with contradictory min and max age does not work', async () => {
  //  const locality = editedLocality

  //  console.log(locality)
  //  const writeResult = await send<{ id: number }>('locality', 'PUT', { locality: locality })
  //  console.log(writeResult)

  //  expect(writeResult.body.id).toEqual(editedLocality.lid) // `Invalid result returned on write: ${writeResult.body.id}`

  //  const { body } = await send<LocalityDetailsType>(`locality/${editedLocality.lid}`, 'GET')
  //  resultLocality = body
  //})
})
