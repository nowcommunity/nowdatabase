import { useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { FieldWithTableSelection } from '@/components/DetailView/common/editingComponents'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { PersonTable } from '@/components/Person/PersonTable'
import { useGetAllPersonsQuery } from '@/redux/personReducer'
import { skipToken } from '@reduxjs/toolkit/query'
import type { PersonDetailsType, ProjectDetailsType } from '@/shared/types'
import type { UserOption } from '@/hooks/useUsersApi'

const formatPersonLabel = ({ surname, first_name }: { surname: string | null; first_name: string | null }) => {
  if (surname) return `${surname}${first_name ? `, ${first_name}` : ''}`
  return 'Unknown'
}

type FormCoordinatorSelectProps = {
  variant?: 'form'
  users: UserOption[]
  value: number | null
  onChange: (userId: number | null) => void
  disabled?: boolean
  error?: string
  helperText?: string
}

type DetailCoordinatorSelectProps = {
  variant: 'detail'
  disabled?: boolean
}

type CoordinatorSelectProps = FormCoordinatorSelectProps | DetailCoordinatorSelectProps

const CoordinatorSelectForm = ({ users, value, onChange, disabled, error, helperText }: FormCoordinatorSelectProps) => {
  const [open, setOpen] = useState(false)
  const selectedUser = useMemo(() => users.find(user => user.userId === value) ?? null, [users, value])

  const handleSelect = (userId: number | null) => {
    onChange(userId)
    setOpen(false)
  }

  return (
    <Stack spacing={1} alignItems="flex-start">
      <FormControl fullWidth error={Boolean(error)} disabled={disabled}>
        <TextField
          label="Coordinator"
          value={selectedUser?.label ?? ''}
          placeholder="Select coordinator"
          inputProps={{ readOnly: true }}
          onClick={() => setOpen(true)}
          disabled={disabled}
        />
        <FormHelperText>{error || helperText}</FormHelperText>
      </FormControl>

      <Button variant="outlined" onClick={() => setOpen(true)} disabled={disabled} data-testid="select-coordinator">
        Select Coordinator
      </Button>

      <Dialog open={open} fullWidth maxWidth="sm" onClose={() => setOpen(false)}>
        <DialogTitle>Select coordinator</DialogTitle>
        <DialogContent>
          {users.length ? (
            <List>
              {users.map(user => (
                <ListItemButton
                  key={user.userId}
                  onClick={() => handleSelect(user.userId)}
                  data-testid={`coordinator-${user.userId}`}
                >
                  <ListItemText
                    primary={user.label}
                    secondary={<Typography color="text.secondary">{user.initials}</Typography>}
                  />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No eligible users found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSelect(null)} disabled={disabled}>
            Clear selection
          </Button>
          <Button variant="contained" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

const CoordinatorSelectDetail = ({ disabled }: DetailCoordinatorSelectProps) => {
  const { data } = useDetailContext<ProjectDetailsType & { com_people?: PersonDetailsType }>()
  const { mode } = useDetailContext<ProjectDetailsType>()
  const { isLoading } = useGetAllPersonsQuery(mode.read ? skipToken : undefined)

  const displayValue = useMemo(() => {
    if ('com_people' in data && data.com_people) return formatPersonLabel(data.com_people)
    return data.contact ?? ''
  }, [data])

  return (
    <FieldWithTableSelection<PersonDetailsType, ProjectDetailsType>
      targetField="contact"
      sourceField="initials"
      selectorTable={<PersonTable />}
      displayValue={displayValue}
      getDisplayValue={person => formatPersonLabel(person)}
      disabled={disabled || isLoading}
    />
  )
}

export const CoordinatorSelect = (props: CoordinatorSelectProps) => {
  if (props.variant === 'detail') {
    return <CoordinatorSelectDetail {...props} />
  }

  return <CoordinatorSelectForm {...props} />
}

export default CoordinatorSelect
