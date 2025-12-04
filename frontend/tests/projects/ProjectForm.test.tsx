import { describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ProjectForm, ProjectFormValues } from '@/components/Project/ProjectForm'
import type { UserOption } from '@/hooks/useUsersApi'

describe('ProjectForm', () => {
  const users: UserOption[] = [
    { userId: 1, label: 'Doe, Jane', initials: 'JD' },
    { userId: 2, label: 'Smith, Alex', initials: 'AS' },
  ]

  it('renders coordinator and member selectors', () => {
    render(<ProjectForm users={users} onSubmit={async () => {}} />)

    expect(screen.getByTestId('select-coordinator')).toBeTruthy()
    expect(screen.getByTestId('select-members')).toBeTruthy()
  })

  it('submits selected coordinator and members', async () => {
    const onSubmit = jest.fn((_values: ProjectFormValues) => Promise.resolve())
    const user = userEvent.setup()

    render(
      <ProjectForm
        users={users}
        onSubmit={onSubmit}
        submitLabel="Save"
        initialValues={{
          projectCode: 'PRJ-100',
          projectName: 'Existing Project',
          projectStatus: 'current',
          recordStatus: true,
          memberUserIds: [],
          coordinatorUserId: null,
        }}
      />
    )

    await user.click(screen.getByTestId('select-coordinator'))
    await user.click(screen.getByTestId('coordinator-1'))

    await user.click(screen.getByTestId('select-members'))
    await user.click(screen.getByText('Smith, Alex'))
    await user.click(screen.getByRole('button', { name: /done/i }))

    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          projectCode: 'PRJ-100',
          projectName: 'Existing Project',
          coordinatorUserId: 1,
          projectStatus: 'current',
          recordStatus: true,
          memberUserIds: [2],
        })
      )
    })
  })
})
