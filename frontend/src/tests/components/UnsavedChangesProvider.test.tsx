import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext, useEffect } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { UnsavedChangesProvider } from '@/components/UnsavedChangesProvider'
import { UnsavedChangesContext } from '@/components/unsavedChangesContext'
import { NavigationType, useBlocker, type BlockerFunction, type Location } from 'react-router-dom'

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
const unblockedBlocker = {
  state: 'unblocked',
  proceed: undefined,
  reset: undefined,
  location: undefined,
} as unknown as ReturnType<typeof useBlocker>

const TestConsumer = ({ setDirtyOnMount = true }: { setDirtyOnMount?: boolean }) => {
  const context = useContext(UnsavedChangesContext)

  useEffect(() => {
    if (setDirtyOnMount) {
      context?.setDirty(true)
    }
  }, [context, setDirtyOnMount])

  return <div data-testid="dirty-state">{context?.isDirty ? 'dirty' : 'clean'}</div>
}

const renderWithProvider = (
  blocker: MockedBlocker,
  setDirtyOnMount = true,
  onBlockerPredicate?: (predicate: BlockerFunction) => void
) => {
  mockUseBlocker.mockImplementation((shouldBlock: boolean | BlockerFunction) => {
    if (typeof shouldBlock === 'function') {
      onBlockerPredicate?.(shouldBlock)
    }
    if (!shouldBlock || (typeof shouldBlock === 'boolean' && !shouldBlock)) {
      return unblockedBlocker
    }
    return blocker as unknown as ReturnType<typeof useBlocker>
  })
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <UnsavedChangesProvider>
            <TestConsumer setDirtyOnMount={setDirtyOnMount} />
          </UnsavedChangesProvider>
        ),
      },
    ],
    { initialEntries: ['/'] }
  )

  return render(<RouterProvider router={router} />)
}

describe('UnsavedChangesProvider', () => {
  const proceed = jest.fn(() => undefined)
  const reset = jest.fn(() => undefined)

  const createLocation = (pathname: string, search: string = ''): Location => ({
    pathname,
    search: search,
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
    const user = userEvent.setup()

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

    await user.click(screen.getByRole('button', { name: /leave page/i }))

    expect(proceed).toHaveBeenCalledTimes(1)
  })

  it('does not block navigation within the same path', async () => {
    let blockerPredicate: BlockerFunction | undefined

    renderWithProvider(
      {
        state: 'unblocked',
        location: createLocation('/'),
        proceed,
        reset,
      },
      true,
      predicate => {
        blockerPredicate = predicate
      }
    )

    await waitFor(() => expect(screen.getByTestId('dirty-state').textContent).toBe('dirty'))

    expect(
      blockerPredicate?.({
        currentLocation: createLocation('/species/123', '?tab=0'),
        nextLocation: createLocation('/species/123', '?tab=1'),
        historyAction: NavigationType.Replace,
      })
    ).toBe(false)
    expect(screen.queryByText('Unsaved changes')).toBeNull()
    expect(proceed).not.toHaveBeenCalled()
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
