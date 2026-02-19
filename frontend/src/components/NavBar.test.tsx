import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NavBar } from './NavBar'
import { occurrenceLabels } from '@/constants/occurrenceLabels'
import { Role } from '@/shared/types'

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}))

jest.mock('@/hooks/user', () => ({
  useUser: () => ({
    token: null,
    username: null,
    role: Role.ReadOnly,
    initials: null,
    localities: [],
    isFirstLogin: undefined,
  }),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: jest.fn() }),
}))

jest.mock('../resource/nowlogo.jpg', () => 'now-logo')

describe('NavBar', () => {
  it('shows Occurrences navigation label', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    )

    expect(screen.getByText(occurrenceLabels.plural)).toBeTruthy()
  })
})
