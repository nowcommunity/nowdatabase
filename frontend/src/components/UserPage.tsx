import { useUser } from '@/hooks/user'
import { useGetPersonDetailsQuery } from '@/redux/personReducer'
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const UserPage = () => {
  const user = useUser()
  const navigate = useNavigate()
  const { data: userDetails, isError } = useGetPersonDetailsQuery(user?.initials ?? skipToken)

  useEffect(() => {
    if (!user.username) navigate('/login')
  }, [user, navigate])

  if (!userDetails) return <CircularProgress />
  if (isError || !userDetails.user) return <Box>Error fetching user</Box>
  return (
    <Box sx={{ maxWidth: '30em', marginLeft: 'auto', marginRight: 'auto' }}>
      <Typography variant="h4">User</Typography>
      <Divider sx={{ marginBottom: '1em' }} />
      <Stack gap={2}>
        <Box>
          <b>Username:</b> {user.username}
        </Box>

        <Box>
          <b>Initials:</b> {user.initials}
        </Box>

        <Box>
          <b>Last login:</b> {userDetails.user.last_login?.toString() || 'No data'}
        </Box>
      </Stack>
    </Box>
  )
}
