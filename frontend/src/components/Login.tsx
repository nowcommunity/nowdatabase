import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useTryLoginMutation, setUser } from '../redux/userReducer'
import { useDispatch } from 'react-redux'
import { Box, Button, CircularProgress, Container, Stack, TextField } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../redux/api'
import { useNotify } from '@/hooks/notification'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginMutation, { data, isLoading }] = useTryLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const loginHadExpired = search.get('expired')
  const notify = useNotify()

  useEffect(() => {
    if (loginHadExpired) notify('Your login expired. Please log in again.')
    // Putting notify into this causes the notification to not disappear, so don't do it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

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
    if (error) {
      return
    }
    setUsernameError('')
    setPasswordError('')
    try {
      const result = await loginMutation({ username, password }).unwrap()
      notify('Logged in!')
      dispatch(setUser(result))

      // Reset api cache, so that we won't show guest data (which could have omitted items) to a logged user
      dispatch(api.util.resetApiState())
      if (result.isFirstLogin) {
        navigate(`/person/user-page`)
      } else {
        navigate('/')
      }
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'status' in e && e.status === 403) {
        notify('Login unsuccessful. Please check credentials.', 'error')
        return
      }
      notify('Login unsuccessful for unknown reason', 'error')
    }
  }

  return (
    <Container style={{ alignContent: 'center' }} maxWidth="sm">
      <Box>
        <p style={{ fontSize: 20 }}>
          <b>Welcome!</b> The users from the old Now Database application work here. If you are logging in this new
          version for the first time, you can use your password of the old application.
        </p>
        <p style={{ fontSize: 20 }}>
          However, upon first login, <b>please change your password</b> in this application. After changing it, the new
          password will be used for this new version, but the <b>old version will still work with your old password</b>.
        </p>
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
        </Stack>
      </form>
      {(isLoading || data) && <CircularProgress style={{ marginLeft: '1em' }} />}
    </Container>
  )
}
