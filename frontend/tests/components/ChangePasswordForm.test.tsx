import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'
import { ChangePasswordForm } from '@/components/Person/Tabs/ChangePasswordForm'

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({
    notify: jest.fn(),
    setMessage: jest.fn(),
  }),
}))

jest.mock('@/redux/userReducer', () => ({
  useChangePasswordMutation: () => [jest.fn(), {}],
  removeFirstLogin: jest.fn(),
}))

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}))

describe('ChangePasswordForm', () => {
  it('shows password requirements before submission', () => {
    render(<ChangePasswordForm />)

    const requirementsHeading = screen.getByText('Password requirements')
    const minLengthRequirement = screen.getByText('Password must be at least 8 characters long')
    const allowedCharactersRequirement = screen.getByText(
      'Password must only contain characters a-z, A-Z, 0-9 and ^?$%&~!'
    )

    expect(requirementsHeading).toBeDefined()
    expect(minLengthRequirement).toBeDefined()
    expect(allowedCharactersRequirement).toBeDefined()
  })

  it('disables submit when required fields are missing', async () => {
    render(<ChangePasswordForm />)

    const user = userEvent.setup()
    const submitButton = screen.getByRole('button', { name: /change password/i })
    expect((submitButton as HTMLButtonElement).disabled).toBe(true)

    await user.type(screen.getByTestId('old-password-input'), 'oldPassword123')
    await user.type(screen.getByTestId('new-password-input'), 'ValidPass1')

    expect((submitButton as HTMLButtonElement).disabled).toBe(true)
  })

  it('disables submit when confirmation does not match', async () => {
    render(<ChangePasswordForm />)

    const user = userEvent.setup()
    const submitButton = screen.getByRole('button', { name: /change password/i })

    await user.type(screen.getByTestId('old-password-input'), 'oldPassword123')
    await user.type(screen.getByTestId('new-password-input'), 'ValidPass1')
    await user.type(screen.getByTestId('verify-password-input'), 'DifferentPass1')

    expect((submitButton as HTMLButtonElement).disabled).toBe(true)
  })

  it('enables submit when all requirements are met', async () => {
    render(<ChangePasswordForm />)

    const user = userEvent.setup()
    const submitButton = screen.getByRole('button', { name: /change password/i })

    await user.type(screen.getByTestId('old-password-input'), 'oldPassword123')
    await user.type(screen.getByTestId('new-password-input'), 'ValidPass1')
    await user.type(screen.getByTestId('verify-password-input'), 'ValidPass1')

    expect((submitButton as HTMLButtonElement).disabled).toBe(false)
  })
})
