import { useMemo, useState } from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllPersonsQuery } from '@/redux/personReducer'
import { skipToken } from '@reduxjs/toolkit/query'
import type { MRT_ColumnDef } from 'material-react-table'
import type { PersonDetailsType, ProjectDetailsType, ProjectPeople, RowState } from '@/shared/types'
import type { UserOption } from '@/hooks/useUsersApi'

type ProjectMemberRow = ProjectPeople & { com_people?: PersonDetailsType; rowState?: RowState }

type FormMembersSelectProps = {
  variant?: 'form'
  users: UserOption[]
  value: number[]
  onChange: (userIds: number[]) => void
  disabled?: boolean
  excludeUserIds?: number[]
  helperText?: string
}

type DetailMembersSelectProps = {
  variant: 'detail'
}

type MembersMultiSelectProps = FormMembersSelectProps | DetailMembersSelectProps

const memberColumns: MRT_ColumnDef<ProjectMemberRow>[] = [
  {
    header: 'Surname',
    id: 'surname',
    accessorFn: row => row.com_people?.surname ?? '',
  },
  {
    header: 'First name',
    id: 'first_name',
    accessorFn: row => row.com_people?.first_name ?? '',
  },
  {
    header: 'Organization',
    id: 'organization',
    accessorFn: row => row.com_people?.organization ?? '',
  },
]

const personColumns: MRT_ColumnDef<PersonDetailsType>[] = [
  { header: 'Surname', accessorKey: 'surname' },
  { header: 'First name', accessorKey: 'first_name' },
  { header: 'Organization', accessorKey: 'organization' },
]

const MembersMultiSelectForm = ({
  users,
  value,
  onChange,
  disabled,
  excludeUserIds = [],
  helperText,
}: FormMembersSelectProps) => {
  const [open, setOpen] = useState(false)
  const filteredUsers = useMemo(
    () => users.filter(user => !excludeUserIds.includes(user.userId)),
    [excludeUserIds, users]
  )

  const toggleMember = (userId: number) => {
    if (value.includes(userId)) {
      onChange(value.filter(id => id !== userId))
    } else {
      onChange([...value, userId])
    }
  }

  const selectedLabels = useMemo(
    () =>
      filteredUsers
        .filter(user => value.includes(user.userId))
        .map(user => user.label)
        .sort()
        .join(', '),
    [filteredUsers, value]
  )

  const handleClear = () => {
    onChange([])
    setOpen(false)
  }

  return (
    <Stack spacing={1} alignItems="flex-start">
      <FormControl fullWidth disabled={disabled}>
        <TextField
          label="Members"
          value={selectedLabels}
          placeholder="Select project members"
          inputProps={{ readOnly: true }}
          onClick={() => setOpen(true)}
          disabled={disabled}
        />
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>

      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        disabled={disabled || !filteredUsers.length}
        data-testid="select-members"
      >
        Select Members
      </Button>

      <Dialog open={open} fullWidth maxWidth="sm" onClose={() => setOpen(false)}>
        <DialogTitle>Select project members</DialogTitle>
        <DialogContent>
          {filteredUsers.length ? (
            <List>
              {filteredUsers.map(user => {
                const checked = value.includes(user.userId)
                return (
                  <ListItemButton key={user.userId} onClick={() => toggleMember(user.userId)}>
                    <ListItemIcon>
                      <Checkbox edge="start" tabIndex={-1} disableRipple checked={checked} />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.label}
                      secondary={<Typography color="text.secondary">{user.initials}</Typography>}
                    />
                  </ListItemButton>
                )
              })}
            </List>
          ) : (
            <Typography color="text.secondary">No eligible users available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClear} disabled={disabled}>
            Clear selection
          </Button>
          <Button variant="contained" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

const MembersMultiSelectDetail = () => {
  const { editData, setEditData, mode } = useDetailContext<ProjectDetailsType>()
  const { data: people, isError } = useGetAllPersonsQuery(mode.read ? skipToken : undefined)

  const selectablePeople = useMemo(
    () => (people ?? []).filter(person => typeof person.user?.user_id === 'number'),
    [people]
  )

  const selectingTable = (
    <SelectingTable<PersonDetailsType, ProjectDetailsType>
      buttonText="Select project members"
      dataCy="select-project-members"
      data={selectablePeople}
      columns={personColumns}
      title="People"
      isError={Boolean(isError)}
      fieldName="now_proj_people"
      idFieldName="initials"
      selectedValues={editData.now_proj_people
        .map((member: ProjectMemberRow) => member.initials)
        .filter((initial: string): initial is string => typeof initial === 'string')}
      editingAction={person =>
        setEditData({
          ...editData,
          now_proj_people: [
            ...editData.now_proj_people,
            { pid: editData.pid, initials: person.initials, com_people: person, rowState: 'new' },
          ],
        })
      }
    />
  )

  return (
    <Grouped title="Project Members">
      {!mode.read && selectingTable}
      <EditableTable<ProjectMemberRow, ProjectDetailsType>
        columns={memberColumns}
        field="now_proj_people"
        idFieldName="initials"
        url="person"
      />
    </Grouped>
  )
}

export const MembersMultiSelect = (props: MembersMultiSelectProps) => {
  if (props.variant === 'detail') {
    return <MembersMultiSelectDetail />
  }

  return <MembersMultiSelectForm {...props} />
}

export default MembersMultiSelect
