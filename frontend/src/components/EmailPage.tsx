import { useUser } from '@/hooks/user'
import { useEmailMutation } from '@/redux/emailReducer'
import { Role } from '@/shared/types'
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

export const EmailPage = () => {
  const user = useUser()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [sendEmailMutation, { isSuccess, isLoading, isError }] = useEmailMutation()
  if (user.role !== Role.Admin) return <Box>Your user is not authorized to view this page.</Box>

  document.title = 'Send Email'

  const handleSend = () => {
    const confirm = window.confirm(`Send email?`)
    if (!confirm) return
    void sendEmailMutation({ title, message })
  }

  return (
    <Box>
      <Stack gap={2} sx={{ maxWidth: '40em', margin: 'auto' }}>
        <Typography variant="h4">Send email</Typography>
        <Divider />
        <Typography variant="h5">Title</Typography>
        <TextField onChange={event => setTitle(event.currentTarget.value)} title="Title" />
        <Typography variant="h5">Message</Typography>
        <TextField
          rows={3}
          size="medium"
          multiline={true}
          onChange={event => setMessage(event.currentTarget.value)}
          title="Message"
        />
        <Button onClick={handleSend} variant="contained" disabled={isSuccess || isLoading || isError}>
          {isSuccess || isLoading || isError ? 'Email sent' : 'Send email'}
        </Button>
      </Stack>
    </Box>
  )
}
