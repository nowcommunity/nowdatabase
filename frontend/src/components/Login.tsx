import { useState } from 'react'
import { useTryLoginMutation } from '../redux/userReducer'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginMutation, result] = useTryLoginMutation()

  const login = async () => {
    await loginMutation({ username, password })
  }

  return (
    <div>
      <p>
        <b>Username</b>
      </p>
      <p>
        <input type="text" onChange={event => setUsername(event.currentTarget.value)} value={username}></input>
      </p>
      <p>
        <b>Password</b>
      </p>
      <p>
        <input type="password" onChange={event => setPassword(event.currentTarget.value)} value={password}></input>
      </p>
      <button onClick={login}>Login</button>
      {result.isSuccess && <div>{JSON.stringify(result, null, 2)}</div>}
    </div>
  )
}
