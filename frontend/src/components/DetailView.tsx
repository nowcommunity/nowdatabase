import { useNavigate } from 'react-router-dom'
import { Box, Button, Paper, Stack, Tab, Tabs } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { ReactNode, useState } from 'react'
import { DetailContextProvider, ModeType } from './Locality/Tabs/Context/DetailContext'
import { useDetailContext } from './Locality/Tabs/Context/hook'

export type TabType = {
  title: string
  content: JSX.Element
}

export const DataValue = <T, K extends keyof T>({ field, element: editElement }: { field: K; element: ReactNode }) => {
  const { data, mode } = useDetailContext<T>()
  if (mode === 'edit') {
    return editElement
  }
  return data[field]
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

export const DetailView = <T,>({ tabs, data }: { tabs: TabType[]; data: T }) => {
  const [tab, setTab] = useState(0)
  const [mode, setMode] = useState<ModeType>('read')

  return (
    <Stack rowGap={4}>
      <ReturnButton />
      <Button onClick={() => setMode(mode === 'edit' ? 'read' : 'edit')}>
        {mode === 'read' ? 'Edit' : 'Stop editing'}
      </Button>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_event, newValue) => setTab(newValue)}>
          {tabs.map(tab => (
            <Tab key={tab.title} label={tab.title} />
          ))}
        </Tabs>
      </Box>
      <DetailContextProvider contextState={{ actions: [], mode, data }}>
        <Paper style={{ minHeight: '10em' }}>{tabs[tab].content}</Paper>
      </DetailContextProvider>
    </Stack>
  )
}
