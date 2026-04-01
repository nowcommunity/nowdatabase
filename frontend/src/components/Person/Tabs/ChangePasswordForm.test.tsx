import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ChangePasswordForm } from './ChangePasswordForm'

const mockNotify = jest.fn()
const mockDispatch = jest.fn()
const mockUnwrap = jest.fn()
const mockChangePasswordMutation = jest.fn(() => ({ unwrap: mockUnwrap }))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: mockNotify }),
}))

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}))

jest.mock('@/redux/userReducer', () => ({
  removeFirstLogin: () => ({ type: 'user/removeFirstLogin' }),
  useChangePasswordMutation: () => [mockChangePasswordMutation],
}))

jest.mock('@/hooks/usePasswordValidation', () => ({
  usePasswordValidation: () => ({
    passwordRequirements: ['At least 8 characters'],
    validatePassword: (password: string) => ({
      isValid: password.length >= 8,
      error: password.length >= 8 ? undefined : 'Password must be at least 8 characters long',
    }),
  }),
}))

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    mockNotify.mockReset()
    mockDispatch.mockReset()
    mockChangePasswordMutation.mockClear()
    mockUnwrap.mockReset()
    mockUnwrap.mockImplementation(() => Promise.resolve())
  })

  it('requires the old password for self-service password changes', () => {
    render(<ChangePasswordForm />)

    expect(screen.getByTestId('old-password-input')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Change password' })).toHaveProperty('disabled', true)
  })

  it('lets admins set another users password without showing the old password field', async () => {
    render(<ChangePasswordForm targetUserId={42} />)

    expect(screen.queryByTestId('old-password-input')).toBeNull()

    fireEvent.change(screen.getByTestId('new-password-input'), { target: { value: 'validpass' } })
    fireEvent.change(screen.getByTestId('verify-password-input'), { target: { value: 'validpass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Set password' }))

    expect(mockChangePasswordMutation).toHaveBeenCalledWith({
      newPassword: 'validpass',
      oldPassword: '',
      targetUserId: 42,
    })
    expect(mockDispatch).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith('Password changed successfully for user.')
    })
  })

  it('rejects setting the same password in self-service mode', async () => {
    render(<ChangePasswordForm />)

    fireEvent.change(screen.getByTestId('old-password-input'), { target: { value: 'validpass' } })
    fireEvent.change(screen.getByTestId('new-password-input'), { target: { value: 'validpass' } })
    fireEvent.change(screen.getByTestId('verify-password-input'), { target: { value: 'validpass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Change password' }))

    expect(mockChangePasswordMutation).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith('New password must be different from your current password.', 'error')
    })
  })
})
