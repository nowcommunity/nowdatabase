import { renderHook } from '@testing-library/react'
import { ReactNode } from 'react'
import { UnsavedChangesProvider } from '@/components/UnsavedChangesProvider'
import { useUnsavedChangesPrompt } from '../../hooks/useUnsavedChangesPrompt'
import { useBlocker } from 'react-router-dom'

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useBlocker: jest.fn(),
  }
})

const wrapper = ({ children }: { children: ReactNode }) => <UnsavedChangesProvider>{children}</UnsavedChangesProvider>

describe('useUnsavedChangesPrompt', () => {
  let addEventListenerSpy: jest.SpyInstance
  let removeEventListenerSpy: jest.SpyInstance
  const mockUseBlocker = useBlocker as jest.MockedFunction<typeof useBlocker>

  beforeEach(() => {
    // Mock window.addEventListener and removeEventListener
    addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    mockUseBlocker.mockReturnValue({
      state: 'unblocked',
      proceed: undefined,
      reset: undefined,
      location: undefined,
    } as ReturnType<typeof useBlocker>)
  })

  afterEach(() => {
    // Restore mocks
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it('should add beforeunload event listener when hasUnsavedChanges is true', () => {
    renderHook(() => useUnsavedChangesPrompt(true), { wrapper })

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })

  it('should not add beforeunload event listener when hasUnsavedChanges is false', () => {
    renderHook(() => useUnsavedChangesPrompt(false), { wrapper })

    expect(addEventListenerSpy).not.toHaveBeenCalled()
  })

  it('should remove event listener on cleanup when hasUnsavedChanges was true', () => {
    const { unmount } = renderHook(() => useUnsavedChangesPrompt(true), { wrapper })

    // Get the handler that was added
    const handler = (addEventListenerSpy.mock.calls[0] as unknown[])?.[1] as (event: BeforeUnloadEvent) => void

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', handler)
  })

  it('should update event listener when hasUnsavedChanges changes from false to true', () => {
    const { rerender } = renderHook(({ hasUnsavedChanges }) => useUnsavedChangesPrompt(hasUnsavedChanges), {
      initialProps: { hasUnsavedChanges: false },
      wrapper,
    })

    expect(addEventListenerSpy).not.toHaveBeenCalled()

    rerender({ hasUnsavedChanges: true })

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })

  it('should remove event listener when hasUnsavedChanges changes from true to false', () => {
    const { rerender } = renderHook(({ hasUnsavedChanges }) => useUnsavedChangesPrompt(hasUnsavedChanges), {
      initialProps: { hasUnsavedChanges: true },
      wrapper,
    })

    const handler = (addEventListenerSpy.mock.calls[0] as unknown[])?.[1] as (event: BeforeUnloadEvent) => void

    rerender({ hasUnsavedChanges: false })

    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', handler)
  })

  it('should call preventDefault on the event when hasUnsavedChanges is true', () => {
    renderHook(() => useUnsavedChangesPrompt(true), { wrapper })

    // Get the handler function that was registered
    const handler = (addEventListenerSpy.mock.calls[0] as unknown[])?.[1] as (event: BeforeUnloadEvent) => void

    // Create a mock event
    const mockEvent = {
      preventDefault: jest.fn(),
      returnValue: '',
    } as unknown as BeforeUnloadEvent

    // Call the handler
    handler(mockEvent)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockEvent.returnValue).toBe('You have unsaved changes. Do you want to leave this page without saving?')
  })

  it('should set returnValue to the active prompt message', () => {
    renderHook(() => useUnsavedChangesPrompt(true), { wrapper })

    const handler = (addEventListenerSpy.mock.calls[0] as unknown[])?.[1] as (event: BeforeUnloadEvent) => void

    const mockEvent = {
      preventDefault: jest.fn<void, []>(),
      returnValue: 'initial',
    } as unknown as BeforeUnloadEvent

    handler(mockEvent)

    expect(mockEvent.returnValue).toBe('You have unsaved changes. Do you want to leave this page without saving?')
  })

  it('should not add multiple event listeners when re-rendered with same hasUnsavedChanges value', () => {
    const { rerender } = renderHook(({ hasUnsavedChanges }) => useUnsavedChangesPrompt(hasUnsavedChanges), {
      initialProps: { hasUnsavedChanges: true },
      wrapper,
    })

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)

    rerender({ hasUnsavedChanges: true })

    // Should still be called only once (not added again)
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  })
})
