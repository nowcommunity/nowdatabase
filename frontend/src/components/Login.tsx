import { useEffect, useState } from 'react'
import { useTryLoginMutation, setUser } from '../redux/userReducer'
import { useDispatch } from 'react-redux'
import { CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginMutation, { data, isLoading }] = useTryLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const login = async () => {
    loginMutation({ username, password })
  }

  useEffect(() => {
    if (data && data.token) {
      dispatch(setUser({ username: data.username, token: data.token }))
      navigate('/')
    }
  }, [data, dispatch, navigate])

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
      {(isLoading || data) && <CircularProgress style={{ marginLeft: '1em' }} />}
    </div>
  )
}
