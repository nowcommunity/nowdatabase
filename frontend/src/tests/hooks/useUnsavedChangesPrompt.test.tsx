import { renderHook } from '@testing-library/react'
import { useUnsavedChangesPrompt } from '../../hooks/useUnsavedChangesPrompt'

describe('useUnsavedChangesPrompt', () => {
  let addEventListenerSpy: jest.SpyInstance
  let removeEventListenerSpy: jest.SpyInstance

  beforeEach(() => {
    // Mock window.addEventListener and removeEventListener
    addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    // Restore mocks
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it('should add beforeunload event listener when hasUnsavedChanges is true', () => {
    renderHook(() => useUnsavedChangesPrompt(true))

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })

  it('should not add beforeunload event listener when hasUnsavedChanges is false', () => {
    renderHook(() => useUnsavedChangesPrompt(false))

    expect(addEventListenerSpy).not.toHaveBeenCalled()
  })

  it('should remove event listener on cleanup when hasUnsavedChanges was true', () => {
    const { unmount } = renderHook(() => useUnsavedChangesPrompt(true))

    // Get the handler that was added
    const handler = addEventListenerSpy.mock.calls[0][1] as (
      event: BeforeUnloadEvent,
    ) => void

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', handler)
  })

  it('should update event listener when hasUnsavedChanges changes from false to true', () => {
    const { rerender } = renderHook(
      ({ hasUnsavedChanges }) => useUnsavedChangesPrompt(hasUnsavedChanges),
      {
        initialProps: { hasUnsavedChanges: false },
      },
    )

    expect(addEventListenerSpy).not.toHaveBeenCalled()

    rerender({ hasUnsavedChanges: true })

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })

  it('should remove event listener when hasUnsavedChanges changes from true to false', () => {
    const { rerender } = renderHook(
      ({ hasUnsavedChanges }) => useUnsavedChangesPrompt(hasUnsavedChanges),
      {
        initialProps: { hasUnsavedChanges: true },
      },
    )

    const handler = addEventListenerSpy.mock.calls[0][1] as (
      event: BeforeUnloadEvent,
    ) => void

    rerender({ hasUnsavedChanges: false })

    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', handler)
  })

  it('should call preventDefault on the event when hasUnsavedChanges is true', () => {
    renderHook(() => useUnsavedChangesPrompt(true))

    // Get the handler function that was registered
    const handler = addEventListenerSpy.mock.calls[0][1] as (
      event: BeforeUnloadEvent,
    ) => void

    // Create a mock event
    const mockEvent = {
      preventDefault: jest.fn(),
      returnValue: '',
    } as unknown as BeforeUnloadEvent

    // Call the handler
    handler(mockEvent)

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockEvent.returnValue).toBe('')
  })

  it('should set returnValue to empty string to trigger browser prompt', () => {
    renderHook(() => useUnsavedChangesPrompt(true))

    const handler = addEventListenerSpy.mock.calls[0][1] as (
      event: BeforeUnloadEvent,
    ) => void

    const mockEvent = {
      preventDefault: jest.fn<void, []>(),
      returnValue: 'initial',
    } as unknown as BeforeUnloadEvent

    handler(mockEvent)

    expect(mockEvent.returnValue).toBe('')
  })

  it('should not add multiple event listeners when re-rendered with same hasUnsavedChanges value', () => {
    const { rerender } = renderHook(
      ({ hasUnsavedChanges }) => useUnsavedChangesPrompt(hasUnsavedChanges),
      {
        initialProps: { hasUnsavedChanges: true },
      },
    )

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)

    rerender({ hasUnsavedChanges: true })

    // Should still be called only once (not added again)
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  })
})
