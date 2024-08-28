import { describe, it, before } from 'node:test'
import assert from 'node:assert/strict'
import { EditDataType, EditMetaData, LocalityDetailsType, SpeciesDetailsType } from '../../../frontend/src/backendTypes'

const baseUrl = 'http://localhost:4000'

let token: string | null = null

const send = async <T extends Record<string, unknown>>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: object
) => {
  const headers = new Headers()

  headers.append('Content-Type', 'application/json')
  if (token) headers.append('authorization', `bearer ${token}`)

  const options = { body: method !== 'GET' ? JSON.stringify(body) : undefined, method, headers }
  const result = await fetch(`${baseUrl}/${path}`, options)
  if (!result) return {}
  const r = await result.text()
  if (!r) return { body: {} as T, status: result.status }
  return { body: JSON.parse(r) as T, status: result.status }
}

void describe('Locality write works', () => {
  before(async () => {
    await send('test/create-test-users', 'GET')
  })
  void it('Edits name, synonyms and locality species correctly', async () => {
    const loginResponse = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
    if (loginResponse?.body?.token) token = loginResponse.body.token
    else throw Error('Login unsuccessful')

    const locality: EditDataType<LocalityDetailsType> & EditMetaData = {
      lid: 21050,
      loc_name: 'new_test_name',
      now_mus: [],
      now_ls: [
        {
          rowState: 'new',
          species_id: 21052,
          lid: 21050,
          com_species: { species_id: 21052 } as SpeciesDetailsType,
        },
        {
          rowState: 'removed',
          species_id: 85729,
          lid: 21050,
          com_species: { species_id: 85729 } as SpeciesDetailsType,
        },
      ],
      projects: [],
      now_plr: [],
      now_ss: [],
      now_coll_meth: [],
      now_lau: [],
      now_syn_loc: [],
      comment: '',
      references: [],
    }

    const writeResult = await send<{ id: number }>('locality', 'PUT', { locality })
    assert(writeResult.body.id === locality.lid, `Invalid result returned on write: ${writeResult.body.id}`)

    const { body: resultLocality } = await send<LocalityDetailsType>(`locality/${locality.lid}`, 'GET')
    assert(resultLocality.loc_name === locality.loc_name, 'Name was not changed correctly')

    assert(
      resultLocality.now_ls.find(ls => ls.species_id === 21052 && ls.lid === 21050),
      'Added locality species not found'
    )

    assert(resultLocality.now_ls.length === 2, `Unexpected now_ls length: ${resultLocality.now_ls.length}`)
  })
})
