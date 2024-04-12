import { useNavigate, useParams } from 'react-router-dom'
import { useGetLocalityDetailsQuery } from '../../redux/localityReducer'
import { Box, Button, CircularProgress, Stack, Tab, Tabs } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState } from 'react'

export const LocalityDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetLocalityDetailsQuery(id)
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  if (isError) return <div>Error loading locality details</div>
  if (isLoading || !data) return <CircularProgress />

  const tabs = [
    {
      title: 'Age',
      component: <div>Age stuff</div>,
    },
    {
      title: 'Locality',
      component: <div>Locality stuff</div>,
    },
    {
      title: 'Species',
      component: <div>Species stuff</div>,
    },
  ]

  return (
    <Stack rowGap={4}>
      <Box>
        <Button onClick={() => navigate(-1)}>
          <ArrowBackIcon color="primary" /> Return to localities table
        </Button>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_event, newValue) => setTab(newValue)}>
          {tabs.map(tab => (
            <Tab label={tab.title} />
          ))}
          <Tab label="" />
        </Tabs>
      </Box>
      {tabs[tab].component}
    </Stack>
  )
}
