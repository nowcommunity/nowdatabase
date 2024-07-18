import { useState, ChangeEvent, FormEvent } from 'react'
import { useTryLoginMutation, setUser } from '../redux/userReducer'
import { useDispatch } from 'react-redux'
import { Box, Button, CircularProgress, Container, Stack, TextField, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../redux/api'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginMutation, { data, isLoading, isError }] = useTryLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const loginHadExpired = search.get('expired')

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
    const result = await loginMutation({ username, password }).unwrap()

    if (!result) return

    dispatch(setUser(result))

    // Reset api cache, so that we won't show guest data (which would have omitted items) to a logged user
    dispatch(api.util.resetApiState())

    if (result.isFirstLogin) {
      navigate(`user/${result.initials}`)
    } else {
      navigate('/')
    }
  }

  return (
    <Container style={{ alignContent: 'center' }} maxWidth="sm">
      <Box>
        {loginHadExpired ? (
          <p style={{ color: 'darkorange', fontWeight: 'bold', fontSize: 28 }}>
            Your login expired. Please login again.
          </p>
        ) : (
          <>
            <p style={{ fontSize: 20 }}>
              <b>Welcome!</b> The users from the old Now Database application work here. If you are logging in this new
              version for the first time, you can use your password of the old application.
            </p>
            <p style={{ fontSize: 20 }}>
              However, upon first login, <b>please change your password</b> in this application. After changing it, the
              new password will be used for this new version, but the{' '}
              <b>old version will still work with your old password</b>.
            </p>
          </>
        )}
      </Box>
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
          <Button variant="contained" type="submit" data-cy="login-button" size="large" style={{ fontSize: '1.4em' }}>
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
