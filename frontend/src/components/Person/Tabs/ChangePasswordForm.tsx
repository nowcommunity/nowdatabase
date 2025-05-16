import { useNotify } from '@/hooks/notification'
import { removeFirstLogin, useChangePasswordMutation } from '@/redux/userReducer'
import { Button, Grid, TextField } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

type ChangePasswordError = { status: number; data: { error: string } }

export const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [changePasswordMutation] = useChangePasswordMutation()
  const notify = useNotify()
  const sx = { display: 'flex', alignItems: 'center', width: '10em', fontWeight: 'bold' }
  const dispatch = useDispatch()

  const changePassword = async () => {
    if (newPassword !== verifyPassword) {
      notify('New password was not the same in both fields.', 'error')
      return
    }
    if (newPassword.length === 0 || oldPassword.length === 0) {
      notify('Please fill all fields.', 'error')
      return
    }
    try {
      await changePasswordMutation({ newPassword, oldPassword }).unwrap()
      notify('Password changed successfully.')
      dispatch(removeFirstLogin())
      setOldPassword('')
      setNewPassword('')
      setVerifyPassword('')
    } catch (e) {
      const error = e as ChangePasswordError
      notify(error.data.error, 'error')
    }
  }

  return (
    <Grid container direction="column" sx={{ rowGap: '1em' }}>
      <Grid container direction="row">
        <Grid item sx={sx}>
          Old password:
        </Grid>
        <TextField
          id="old-password-textfield"
          type="password"
          value={oldPassword}
          onChange={event => setOldPassword(event.target.value)}
        />
      </Grid>
      <Grid container direction="row">
        <Grid item sx={sx}>
          New password:
        </Grid>
        <TextField
          id="new-password-textfield"
          type="password"
          value={newPassword}
          onChange={event => setNewPassword(event.target.value)}
        />
      </Grid>
      <Grid container direction="row">
        <Grid item sx={sx}>
          New password again:
        </Grid>
        <TextField
          id="new-password-verification-textfield"
          type="password"
          value={verifyPassword}
          onChange={event => setVerifyPassword(event.target.value)}
        />
      </Grid>
      <Grid container direction="row">
        <Grid item width="27em">
          <Button
            id="change-password-button"
            fullWidth
            sx={{ height: '4em' }}
            variant="contained"
            onClick={() => void changePassword()}
          >
            Change password
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
