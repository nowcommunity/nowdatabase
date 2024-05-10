import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, Paper, Stack, Tab, Tabs } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { useEffect, useState } from 'react'
import { DetailContextProvider, ModeType } from './Context/DetailContext'
import { cloneDeep } from 'lodash-es'
import { DropdownOption, DropdownSelector, EditableTextField, RadioSelector } from './common/FormComponents'

export type TabType = {
  title: string
  content: JSX.Element
}

const ReturnButton = () => {
  const navigate = useNavigate()
  return (
    <Button onClick={() => navigate(-1)}>
      <ArrowBackIcon color="primary" style={{ marginRight: '0.35em' }} />
      Return to table
    </Button>
  )
}

export const DetailView = <T extends object>({ tabs, data }: { tabs: TabType[]; data: T }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const getUrl = () => {
    const tabFromUrl = searchParams.get('tab')
    if (typeof tabFromUrl !== 'string' || isNaN(parseInt(tabFromUrl))) return 0
    return parseInt(tabFromUrl)
  }
  const [mode, setMode] = useState<ModeType>('read')
  const [tab, setTab] = useState(getUrl())

  useEffect(() => {
    setSearchParams(
      params => {
        params.set('tab', tab.toString())
        return params
      },
      { replace: true }
    )
  }, [tab])

  const textField = (field: keyof T) => <EditableTextField<T> field={field} />

  const dropdown = (field: keyof T, options: Array<DropdownOption | string>, name: string) => (
    <DropdownSelector field={field} options={options} name={name} />
  )

  const radioSelection = (field: keyof T, options: string[], name: string) => (
    <RadioSelector field={field} options={options} name={name} />
  )

  const initialState = {
    data,
    mode,
    editData: cloneDeep(data),
    textField,
    dropdown,
    radioSelection,
  }

  return (
    <Stack rowGap={2}>
      <Box sx={{ display: 'flex' }} gap={10}>
        <ReturnButton />
        <Button
          onClick={() => setMode(mode === 'edit' ? 'read' : 'edit')}
          variant={mode === 'edit' ? 'contained' : 'outlined'}
          style={{ width: '12em' }}
        >
          <EditIcon /> {mode === 'read' ? 'Edit' : 'Stop editing'}
        </Button>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_event, newValue) => setTab(newValue)}>
          {tabs.map(tab => (
            <Tab key={tab.title} label={tab.title} />
          ))}
        </Tabs>
      </Box>
      <DetailContextProvider contextState={{ ...initialState }}>
        <Paper
          style={{
            minHeight: '10em',
            backgroundColor: 'lightgray',
            padding: '1em',
          }}
          elevation={5}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1em' }}>{tabs[tab].content}</Box>
        </Paper>
      </DetailContextProvider>
    </Stack>
  )
}
