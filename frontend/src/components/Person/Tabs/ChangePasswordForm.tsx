import { useNotify } from '@/hooks/notification'
import { removeFirstLogin, useChangePasswordMutation } from '@/redux/userReducer'
import { Button, List, ListItem, ListItemText, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { usePasswordValidation } from '@/hooks/usePasswordValidation'

type ChangePasswordError = { status: number; data: { error: string } }

type ChangePasswordFormProps = {
  targetUserId?: number
}

export const ChangePasswordForm = ({ targetUserId }: ChangePasswordFormProps) => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [changePasswordMutation] = useChangePasswordMutation()
  const { notify } = useNotify()
  const sx = { display: 'flex', alignItems: 'center', width: '10em', fontWeight: 'bold' }
  const dispatch = useDispatch()
  const isAdminOverride = typeof targetUserId === 'number'

  const { passwordRequirements, validatePassword } = usePasswordValidation()
  const isPasswordValid = useMemo(() => validatePassword(newPassword).isValid, [newPassword, validatePassword])
  const isFormValid =
    newPassword.length > 0 &&
    verifyPassword.length > 0 &&
    isPasswordValid &&
    (isAdminOverride || oldPassword.length > 0) &&
    newPassword === verifyPassword

  const changePassword = async () => {
    if (newPassword !== verifyPassword) {
      notify('New password was not the same in both fields.', 'error')
      return
    }
    if (!isAdminOverride && newPassword === oldPassword) {
      notify('New password must be different from your current password.', 'error')
      return
    }
    const passwordValidationResult = validatePassword(newPassword)
    if (!passwordValidationResult.isValid) {
      notify(passwordValidationResult.error ?? 'Password does not meet requirements', 'error')
      return
    }
    if (newPassword.length === 0 || (!isAdminOverride && oldPassword.length === 0)) {
      notify('Please fill all fields.', 'error')
      return
    }
    try {
      await changePasswordMutation({ newPassword, oldPassword, targetUserId }).unwrap()
      notify(isAdminOverride ? 'Password changed successfully for user.' : 'Password changed successfully.')
      if (!isAdminOverride) {
        dispatch(removeFirstLogin())
      }
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
      {!isAdminOverride && (
        <Grid container direction="row" size={12}>
          <Grid sx={sx}>Old password:</Grid>
          <TextField
            id="old-password-textfield"
            type="password"
            value={oldPassword}
            onChange={event => setOldPassword(event.target.value)}
            inputProps={{ 'data-testid': 'old-password-input' }}
          />
        </Grid>
      )}
      <Grid container direction="row" size={12}>
        <Grid sx={sx}>New password:</Grid>
        <TextField
          id="new-password-textfield"
          type="password"
          value={newPassword}
          onChange={event => setNewPassword(event.target.value)}
          inputProps={{ 'data-testid': 'new-password-input' }}
        />
      </Grid>
      <Grid container direction="row" size={12}>
        <Grid sx={sx}>New password again:</Grid>
        <TextField
          id="new-password-verification-textfield"
          type="password"
          value={verifyPassword}
          onChange={event => setVerifyPassword(event.target.value)}
          inputProps={{ 'data-testid': 'verify-password-input' }}
        />
      </Grid>
      <Grid container direction="column" size={12} sx={{ rowGap: '0.5em' }}>
        <Typography variant="subtitle1">Password requirements</Typography>
        <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
          {passwordRequirements.map(requirement => (
            <ListItem key={requirement} sx={{ display: 'list-item', py: 0 }}>
              <ListItemText primary={requirement} />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid container direction="row" size={12}>
        <Grid width="27em">
          <Button
            id="change-password-button"
            fullWidth
            sx={{ height: '4em' }}
            variant="contained"
            onClick={() => void changePassword()}
            disabled={!isFormValid}
          >
            {isAdminOverride ? 'Set password' : 'Change password'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
