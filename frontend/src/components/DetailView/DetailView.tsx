import { useSearchParams } from 'react-router-dom'
import { Box, Button, Paper, Stack, Tab, Tabs, useTheme } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useEffect, useState, JSX } from 'react'
import { DetailContextProvider, ModeOptions, ModeType, makeEditData, modeOptionToMode } from './Context/DetailContext'
import {
  DropdownOption,
  DropdownOptionValue,
  DropdownSelector,
  EditableTextField,
  RadioSelector,
} from './common/editingComponents'
import { DetailBrowser } from './DetailBrowser'
import { StagingView } from './StagingView'
import { ReturnButton, WriteButton } from './components'
import { ValidationObject } from '@/validators/validator'
import { EditDataType } from '@/backendTypes'
import { usePageContext } from '../Page'

export type TabType = {
  title: string
  content: JSX.Element
}

export type TextFieldOptions = (
  | {
      type: 'text'
    }
  | {
      type: 'number'
      round?: number
    }
) & {
  disabled?: boolean
  big?: boolean
  changeSetter?: React.Dispatch<React.SetStateAction<number>>
}

export const DetailView = <T extends object>({
  tabs,
  data,
  onWrite,
  validator,
  isNew = false,
  isUserPage = false,
  hasStagingMode = false,
  deleteFunction,
}: {
  tabs: TabType[]
  data: T
  onWrite?: (editData: EditDataType<T>, setEditData: (editData: EditDataType<T>) => void) => Promise<void>
  validator: (editData: EditDataType<T>, field: keyof EditDataType<T>) => ValidationObject
  isNew?: boolean
  isUserPage?: boolean
  hasStagingMode?: boolean
  deleteFunction?: () => Promise<void>
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const theme = useTheme()
  const getUrl = () => {
    const tabFromUrl = searchParams.get('tab')
    if (typeof tabFromUrl !== 'string' || isNaN(parseInt(tabFromUrl))) return 0
    return parseInt(tabFromUrl)
  }
  const { editRights } = usePageContext()
  const [mode, setModeState] = useState<ModeType>(isNew ? modeOptionToMode['new'] : modeOptionToMode['read'])
  const [tab, setTab] = useState(getUrl())

  useEffect(() => {
    setSearchParams(
      params => {
        params.set('tab', tab.toString())
        return params
      },
      { replace: true }
    )
  }, [tab, setSearchParams])

  const setMode = (newMode: ModeOptions) => {
    setModeState(modeOptionToMode[newMode])
  }

  const textField = (field: keyof EditDataType<T>, options?: TextFieldOptions) => (
    <EditableTextField<T> field={field} {...options} />
  )

  const dropdown = (
    field: keyof EditDataType<T>,
    options: Array<DropdownOption | string>,
    name: string,
    disabled?: boolean
  ) => <DropdownSelector field={field} options={options} name={name} disabled={disabled} />

  const onDelete = () => {
    if (!window.confirm('Are you sure you want to delete this item? This operation cannot be undone.')) return
    if (deleteFunction) void deleteFunction()
  }

  const radioSelection = (
    field: keyof EditDataType<T>,
    options: Array<DropdownOption | string>,
    name: string,
    defaultValue?: DropdownOptionValue
  ) => <RadioSelector field={field} options={options} name={name} defaultValue={defaultValue} />

  const bigTextField = (field: keyof EditDataType<T>) => <EditableTextField<T> field={field} type="text" big />

  const initialState = {
    data,
    mode,
    setMode,
    editData: makeEditData(data),
    textField,
    dropdown,
    radioSelection,
    bigTextField,
    validator,
  }

  const paperProps = {
    style: {
      minHeight: '10em',
      padding: '1em',
      backgroundColor: theme.palette.grey[300],
    },
    elevation: 5,
  }

  const stagingView = (
    <Paper {...paperProps}>
      <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1em' }}>
        <StagingView />
      </Box>
    </Paper>
  )

  const tabView = (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {tabs.length > 1 && (
          <Tabs variant="scrollable" value={tab} onChange={(_event, newValue) => setTab(newValue as number)}>
            {tabs.map(tab => (
              <Tab key={tab.title} label={tab.title} />
            ))}
          </Tabs>
        )}
      </Box>
      <Paper {...paperProps}>
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1em' }}>{tabs[tab].content}</Box>
      </Paper>
    </>
  )

  return (
    <Stack rowGap={2}>
      <DetailContextProvider contextState={initialState}>
        {!isUserPage && (
          <Box>
            <DetailBrowser<T> />
          </Box>
        )}
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'space-between', marginTop: 'auto' }}
        >
          <Box sx={{ display: 'flex' }} gap={3}>
            {!isUserPage && <ReturnButton />}
          </Box>
          <Box sx={{ display: 'flex' }} gap={1}>
            {editRights.edit && !mode.staging && !initialState.mode.new && (
              <Button
                id="edit-button"
                onClick={() => setMode(!mode.read ? 'read' : 'edit')}
                variant={mode.read ? 'contained' : 'outlined'}
                style={{ width: '8em' }}
              >
                <EditIcon style={{ marginRight: '0.5em' }} /> {mode.read ? 'Edit' : 'Cancel edit'}
              </Button>
            )}
            {editRights.delete && !isNew && (
              <Button
                id="delete-button"
                onClick={onDelete}
                variant="contained"
                sx={{ width: '8em', color: 'white' }}
                color="error"
              >
                Delete
              </Button>
            )}
            {(!mode.read || initialState.mode.new) && onWrite && (
              <WriteButton onWrite={onWrite} hasStagingMode={hasStagingMode} />
            )}
          </Box>
        </Box>
        {mode.staging ? stagingView : tabView}
      </DetailContextProvider>
    </Stack>
  )
}
