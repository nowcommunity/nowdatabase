import { useNavigate } from 'react-router-dom'
import { Box, Button, Paper, Stack, Tab, Tabs } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { DetailContextProvider, ModeType } from './Context/DetailContext'
import { cloneDeep } from 'lodash-es'

export type TabType = {
  title: string
  content: JSX.Element
}

const ReturnButton = () => {
  const navigate = useNavigate()
  return (
    <Box>
      <Button onClick={() => navigate(-1)}>
        <ArrowBackIcon color="primary" style={{ marginRight: '0.35em' }} />
        Return to table
      </Button>
    </Box>
  )
}

export const DetailView = <T extends object>({ tabs, data }: { tabs: TabType[]; data: T }) => {
  const [tab, setTab] = useState(0)
  const [mode, setMode] = useState<ModeType>('read')

  const initialState = {
    data,
    mode,
    editData: cloneDeep(data),
  }

  return (
    <Stack rowGap={4}>
      <ReturnButton />
      <Button
        onClick={() => setMode(mode === 'edit' ? 'read' : 'edit')}
        variant={mode === 'edit' ? 'contained' : 'outlined'}
        style={{ maxWidth: '20em' }}
      >
        <EditIcon /> {mode === 'read' ? 'Edit' : 'Stop editing'}
      </Button>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_event, newValue) => setTab(newValue)}>
          {tabs.map(tab => (
            <Tab key={tab.title} label={tab.title} />
          ))}
        </Tabs>
      </Box>
      <DetailContextProvider contextState={{ ...initialState }}>
        <Paper style={{ minHeight: '10em' }} elevation={14}>
          {tabs[tab].content}
        </Paper>
      </DetailContextProvider>
    </Stack>
  )
}
