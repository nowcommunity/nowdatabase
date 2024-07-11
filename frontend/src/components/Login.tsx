import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { useTryLoginMutation, setUser } from '../redux/userReducer'
import { useDispatch } from 'react-redux'
import { Box, Button, CircularProgress, Container, Stack, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { api } from '../redux/api'
import { Role } from '@/types'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginMutation, { data, isLoading, isError }] = useTryLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let error = false
    if (username.length < 1) {
      setUsernameError('Input username')
      error = true
    }
    if (password.length < 1) {
      setPasswordError('Input password')
      error = true
    }
    if (error) return
    setUsernameError('')
    setPasswordError('')
    await loginMutation({ username, password })
  }

  useEffect(() => {
    if (data && data.token) {
      dispatch(setUser({ username: data.username, token: data.token, role: data.role || Role.ReadOnly }))
      // Reset api cache, so that we won't show guest data to logged user
      dispatch(api.util.resetApiState())
      navigate('/')
    }
  }, [data, dispatch, navigate])

  return (
    <Container style={{ alignContent: 'center' }} maxWidth="sm">
      <form onSubmit={event => void login(event)}>
        <Stack rowGap="1em">
          <TextField
            data-cy="username-basic"
            label="Username"
            variant="outlined"
            type="text"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUsername(event?.currentTarget?.value)}
            value={username}
            error={usernameError.length > 0}
            helperText={usernameError}
            fullWidth
          />
          <TextField
            data-cy="password-basic"
            label="Password"
            variant="outlined"
            type="password"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event?.currentTarget?.value)}
            value={password}
            error={passwordError.length > 0}
            helperText={passwordError}
            fullWidth
          />
          <Button type="submit" data-cy="login-button" size="large" style={{ fontSize: '1.4em' }}>
            Login
          </Button>
          <Box>
            <Typography color="red" align="center">
              {isError && 'Login failed. Please check username and password.'}
            </Typography>
          </Box>
        </Stack>
      </form>
      {(isLoading || data) && <CircularProgress style={{ marginLeft: '1em' }} />}
    </Container>
  )
}
