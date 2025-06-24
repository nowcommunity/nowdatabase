import { SlidingModal } from '@/components/Map/SlidingModal'
import { useNotify } from '@/hooks/notification'
import '../../../styles/AddUserModal.css'
import { Button, IconButton, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import { ChangeEventHandler, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CasinoIcon from '@mui/icons-material/Casino'
import { userGroups } from '@/shared/types'

type ChangePasswordError = { status: number; data: { error: string } }

interface Props {
  isOpen: boolean
  onClose: () => void
}

const UserFieldInput = ({
  field,
  label,
  onChange,
  value,
  password,
}: {
  field: string
  label?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  value: string
  password?: boolean
}) => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  return (
    <>
      <label htmlFor={`user-form-${field}`}>{label ? label : capitalize(field)}:</label>
      <TextField
        variant="outlined"
        size="small"
        className="field"
        type={password ? 'password' : 'text'}
        id={`user-form-${field}`}
        onChange={onChange}
        value={value}
      />
    </>
  )
}

const UserPasswordInput = ({
  onChange,
  value,
}: {
  onChange: (value: string) => void
  value: string
}) => {
  const [hidePassword, setHidePassword] = useState(false)

  const randomPassword = () => {
    const passwordLength = 12
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result: string = ''

    for (let i = 0; i < passwordLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    onChange(result)
  }

  return (
    <>
      <label htmlFor="user-form-password">Password:</label>
      <div className="password-input-container">
        <TextField
          variant="outlined"
          size="small"
          className="field"
          type={hidePassword ? 'password' : 'text'}
          id="user-form-password"
          onChange={e => onChange(e.target.value)}
          value={value}
        />
        <IconButton onClick={() => setHidePassword(v => !v)}>
          {hidePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
        <IconButton onClick={randomPassword}>
          <CasinoIcon />
        </IconButton>
      </div>
    </>
  )
}

const UserGroupSelect = ({
  value,
  onChange,
  id,
}: { value: string; onChange: (e: SelectChangeEvent) => void; id?: string }) => {
  return (
    <Select label={'User group'} value={value} onChange={onChange} size="small" id={id}>
      {userGroups.map(group => (
        <MenuItem key={group} value={group} style={{ height: '2em' }}>
          {group}
        </MenuItem>
      ))}
    </Select>
  )
}

interface UserFieldValues {
  username: string
  password: string
  userGroup: string
}

export const AddUserModal = ({ isOpen, onClose }: Props) => {
  const [fieldValues, setFieldValues] = useState<UserFieldValues>({
    username: '',
    password: '',
    userGroup: userGroups[0],
  })

  return (
    <SlidingModal isOpen={isOpen} onClose={onClose} id="add-user-modal">
      <div className="inputs">
        <UserFieldInput
          field="username"
          value={fieldValues.username}
          onChange={e => setFieldValues({ ...fieldValues, username: e.target.value })}
        />
        <UserPasswordInput
          value={fieldValues.password}
          onChange={value => setFieldValues({ ...fieldValues, password: value })}
        />
        <label htmlFor="user-form-usergroup">User group:</label>
        <UserGroupSelect
          id="user-form-usergroup"
          value={fieldValues.userGroup}
          onChange={e => setFieldValues({ ...fieldValues, userGroup: e.target.value })}
        />
        <div></div>
        <div className="save-btn-container">
          <Button
            variant="contained"
            className="save-btn"
            startIcon={<SaveIcon />}
            onClick={() => console.log(fieldValues)}
          >
            Save
          </Button>
        </div>
      </div>
    </SlidingModal>
  )
}
