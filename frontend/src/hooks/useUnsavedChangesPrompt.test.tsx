import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, RouterProvider, createMemoryRouter } from 'react-router-dom'
import { useState } from 'react'

import { UnsavedChangesProvider } from '@/components/UnsavedChangesProvider'
import { useUnsavedChangesPrompt } from './useUnsavedChangesPrompt'

type RenderOptions = {
  route?: string
}

const renderWithRouter = (element: React.ReactElement, { route = '/' }: RenderOptions = {}) => {
  const router = createMemoryRouter(
    [
      { path: '/', element },
      { path: '/next', element: <div>Next page</div> },
    ],
    { initialEntries: [route] }
  )

  return render(<RouterProvider router={router} />)
}

describe('useUnsavedChangesPrompt', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('enables and disables blocking as the dirty flag changes', async () => {
    const user = userEvent.setup()

    const DirtyToggle = () => {
      const [dirty, setDirty] = useState(false)
      const { isDirty, message } = useUnsavedChangesPrompt(dirty, { message: 'Unsaved form' })

      return (
        <div>
          <div aria-label="dirty-state">{isDirty ? 'dirty' : 'clean'}</div>
          <div aria-label="dialog-message">{message}</div>
          <button type="button" onClick={() => setDirty(previous => !previous)}>
            Toggle dirty
          </button>
        </div>
      )
    }

    renderWithRouter(
      <UnsavedChangesProvider>
        <DirtyToggle />
      </UnsavedChangesProvider>
    )

    expect(screen.getByLabelText('dirty-state').textContent).toBe('clean')

    await user.click(screen.getByRole('button', { name: 'Toggle dirty' }))

    expect(screen.getByLabelText('dirty-state').textContent).toBe('dirty')
    expect(screen.getByLabelText('dialog-message').textContent).toBe('Unsaved form')

    await user.click(screen.getByRole('button', { name: 'Toggle dirty' }))

    expect(screen.getByLabelText('dirty-state').textContent).toBe('clean')
  })

  it('shows a confirmation dialog and proceeds when the user confirms navigation', async () => {
    const user = userEvent.setup()

    const FormPage = () => {
      useUnsavedChangesPrompt(true, { message: 'Changes will be lost' })

      return (
        <div>
          <div>Form page</div>
          <Link to="/next">Go next</Link>
        </div>
      )
    }

    renderWithRouter(
      <UnsavedChangesProvider>
        <FormPage />
      </UnsavedChangesProvider>
    )

    await user.click(screen.getByRole('link', { name: /go next/i }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeDefined()

    await user.click(screen.getByRole('button', { name: /leave page/i }))

    const nextPage = await screen.findByText('Next page')
    expect(nextPage).toBeDefined()
  })

  it('keeps the user on the page when they cancel navigation', async () => {
    const user = userEvent.setup()

    const FormPage = () => {
      useUnsavedChangesPrompt(true)

      return (
        <div>
          <div>Form page</div>
          <Link to="/next">Go next</Link>
        </div>
      )
    }

    renderWithRouter(
      <UnsavedChangesProvider>
        <FormPage />
      </UnsavedChangesProvider>
    )

    await user.click(screen.getByRole('link', { name: /go next/i }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeDefined()

    await user.click(screen.getByRole('button', { name: /stay on page/i }))

    expect(screen.getByText('Form page')).toBeDefined()
  })
})
