import { send } from '../utils'

export async function getTestAuthToken(): Promise<string> {
  const result = await send<{ token: string }>('user/login', 'POST', { 
    username: 'testSu', 
    password: 'test' 
  })
  return result.body.token
}
