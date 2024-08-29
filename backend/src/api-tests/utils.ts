let token: string | null = null
const baseUrl = 'http://localhost:4000'

export const send = async <T extends Record<string, unknown>>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: object
) => {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  if (token) headers.append('authorization', `bearer ${token}`)
  const options = { body: method !== 'GET' ? JSON.stringify(body) : undefined, method, headers }
  const response = await fetch(`${baseUrl}/${path}`, options)
  const responseText = await response.text()
  if (!responseText) return { body: {} as T, status: response.status }
  return { body: JSON.parse(responseText) as T, status: response.status }
}

export const setToken = (newToken: string) => (token = newToken)

export const login = async () => {
  // Make sure test users exist
  await send('test/create-test-users', 'GET')
  // Login and set token
  const result = await send<{ token: string }>('user/login', 'POST', { username: 'testSu', password: 'test' })
  token = result.body.token
}
