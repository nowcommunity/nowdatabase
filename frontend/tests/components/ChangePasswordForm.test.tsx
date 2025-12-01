import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

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
})
