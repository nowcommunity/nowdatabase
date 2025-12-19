import '@testing-library/jest-dom'
import { describe, expect, it, beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext, useEffect } from 'react'

import { UnsavedChangesProvider } from '@/components/UnsavedChangesProvider'
import { UnsavedChangesContext } from '@/components/unsavedChangesContext'
import { useBlocker, type Location, type BlockerFunction } from 'react-router-dom'

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useBlocker: jest.fn(),
  }
})

type MockedBlocker = {
  state: 'blocked' | 'unblocked' | 'proceeding'
  location: Location
  proceed: () => void
  reset: () => void
}

const mockUseBlocker = useBlocker as jest.MockedFunction<typeof useBlocker>

const TestConsumer = ({ setDirtyOnMount = true }: { setDirtyOnMount?: boolean }) => {
  const context = useContext(UnsavedChangesContext)

  useEffect(() => {
    if (setDirtyOnMount) {
      context?.setDirty(true)
    }
  }, [context, setDirtyOnMount])

  return <div data-testid="dirty-state">{context?.isDirty ? 'dirty' : 'clean'}</div>
}

const renderWithProvider = (blocker: MockedBlocker, setDirtyOnMount = true) => {
  mockUseBlocker.mockImplementation((shouldBlock: boolean | BlockerFunction) => {
    if (!shouldBlock || (typeof shouldBlock === 'boolean' && !shouldBlock)) {
      return {
        state: 'unblocked',
        proceed: undefined,
        reset: undefined,
        location: undefined,
      } as unknown as ReturnType<typeof useBlocker>
    }
    return blocker as unknown as ReturnType<typeof useBlocker>
  })
  return render(
    <UnsavedChangesProvider>
      <TestConsumer setDirtyOnMount={setDirtyOnMount} />
    </UnsavedChangesProvider>
  )
}

describe('UnsavedChangesProvider', () => {
  const proceed = jest.fn(() => undefined)
  const reset = jest.fn(() => undefined)

  const createLocation = (pathname: string): Location => ({
    pathname,
    search: '',
    hash: '',
    state: null,
    key: 'test',
  })

  beforeEach(() => {
    jest.clearAllMocks()
    proceed.mockClear()
    reset.mockClear()
  })

  it('shows a dialog when blocked navigation happens to a different path and calls proceed on confirm', async () => {
    renderWithProvider(
      {
        state: 'blocked',
        location: createLocation('/other'),
        proceed,
        reset,
      },
      true
    )

    expect(screen.getByText('Unsaved changes')).toBeTruthy()
    expect(screen.getByText('You have unsaved changes. Do you want to leave this page without saving?')).toBeTruthy()
    expect(screen.getByTestId('dirty-state').textContent).toBe('dirty')

    await userEvent.click(screen.getByRole('button', { name: /leave page/i }))

    expect(proceed).toHaveBeenCalledTimes(1)
  })

  it('auto-proceeds without showing a dialog when navigating within the same path', () => {
    renderWithProvider(
      {
        state: 'blocked',
        location: createLocation(window.location.pathname),
        proceed,
        reset,
      },
      true
    )

    expect(proceed).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Unsaved changes')).toBeNull()
  })

  it('does not show a dialog when not dirty', () => {
    renderWithProvider(
      {
        state: 'unblocked',
        location: createLocation('/same'),
        proceed,
        reset,
      },
      false
    )

    expect(screen.queryByText('Unsaved changes')).toBeNull()
    expect(screen.getByTestId('dirty-state').textContent).toBe('clean')
  })
})
