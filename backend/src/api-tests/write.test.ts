import { describe, it } from 'node:test'
import assert from 'node:assert'
import { EditDataType, EditMetaData, LocalityDetailsType } from '../../../frontend/src/backendTypes'

const baseUrl = 'http://localhost:4000'

let token: string | null = null

const send = async (path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: object) => {
  const headers = new Headers()

  headers.append('Content-Type', 'application/json')

  if (token) headers.append('authorization', `bearer ${token}`)

  const options = method === 'GET' ? {} : { body: JSON.stringify(body), method, headers }
  const result = await fetch(`${baseUrl}/${path}`, options)
  const resultBody = (await result.json()) as Record<string, unknown>
  return { body: resultBody, status: result.status }
}

void describe('Locality editing works', () => {
  void it('works', async () => {
    const loginResponse = await send('user/login', 'POST', { username: 'testSu', password: 'test' })
    if (loginResponse?.body?.token) token = loginResponse.body.token as string
    else throw Error('Login unsuccessful')

    const locality: EditDataType<LocalityDetailsType> & EditMetaData = {
      lid: 20920,
      loc_name: 'new_test_name',
      now_mus: [],
      now_ls: [],
      projects: [],
      now_plr: [],
      now_ss: [],
      now_coll_meth: [],
      now_lau: [],
      now_syn_loc: [],
      comment: '',
      references: [],
    }

    const result = await send('locality', 'PUT', { locality })
    assert(result.body.id === 20920, 'Invalid result')
  })
})
