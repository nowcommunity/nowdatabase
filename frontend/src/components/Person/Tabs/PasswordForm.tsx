import { Button, Grid, TextField } from '@mui/material'
import { useState } from 'react'

export const PasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const sx = { display: 'flex', alignItems: 'center', width: '10em', fontWeight: 'bold' }

  const changePassword = () => {
    if (newPassword !== verifyPassword) {
      return
    }
  }

  return (
    <Grid container direction="column" sx={{ rowGap: '1em' }}>
      <Grid container direction="row">
        <Grid item sx={sx}>
          Old password:
        </Grid>
        <TextField type="password" value={oldPassword} onChange={event => setOldPassword(event.target.value)} />
      </Grid>
      <Grid container direction="row">
        <Grid item sx={sx}>
          New password:
        </Grid>
        <TextField type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} />
      </Grid>
      <Grid container direction="row">
        <Grid item sx={sx}>
          New password again:
        </Grid>
        <TextField type="password" value={verifyPassword} onChange={event => setVerifyPassword(event.target.value)} />
      </Grid>
      <Grid container direction="row">
        <Grid item width="27em">
          <Button fullWidth sx={{ height: '4em' }} variant="contained" onClick={changePassword}>
            Change password
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
