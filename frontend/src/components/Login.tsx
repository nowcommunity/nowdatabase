import { useEffect, useState } from 'react'
import { useTryLoginMutation, setToken } from '../redux/userReducer'
import { useDispatch } from 'react-redux'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginMutation, { data }] = useTryLoginMutation()
  const dispatch = useDispatch()
  const login = async () => {
    loginMutation({ username, password })
  }

  useEffect(() => {
    if (data && data.token) {
      dispatch(setToken(data.token))
    }
  }, [data, dispatch])

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
    </div>
  )
}
