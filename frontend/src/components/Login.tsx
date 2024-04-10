import { useEffect, useState } from 'react'
import { useTryLoginMutation, setUser } from '../redux/userReducer'
import { useDispatch } from 'react-redux'
import { Button, CircularProgress, Container, TextField } from '@mui/material'
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
    <Container maxWidth="sm">
      <p>
        <TextField
          id="username-basic"
          label="Username"
          variant="outlined"
          type="text"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event?.currentTarget?.value)}
          value={username}
        />
      </p>
      <p>
        <TextField
          id="password-basic"
          label="Password"
          variant="outlined"
          type="password"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event?.currentTarget?.value)}
          value={password}
        />
      </p>
      <Button onClick={login} size="large">
        Login
      </Button>
      {(isLoading || data) && <CircularProgress style={{ marginLeft: '1em' }} />}
    </Container>
  )
}
