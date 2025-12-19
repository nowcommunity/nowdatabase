import { describe, expect, it, beforeEach, jest } from '@jest/globals'
import { render, act } from '@testing-library/react'
import { ReactNode } from 'react'

import { UnsavedChangesContext, type UnsavedChangesContextValue } from '@/components/unsavedChangesContext'
import { useUnsavedChangesPrompt } from '@/hooks/useUnsavedChangesPrompt'

const createContextMock = () => {
  const setDirty = jest.fn<(dirty: boolean) => void>()
  const setMessage = jest.fn<(message: string) => void>()
  const resetMessage = jest.fn<() => void>()

  const value: UnsavedChangesContextValue = {
    isDirty: false,
    message: 'default message',
    setDirty,
    setMessage,
    resetMessage,
  }

  return { value, setDirty, setMessage, resetMessage }
}

const Wrapper = ({ children, contextValue }: { children: ReactNode; contextValue: UnsavedChangesContextValue }) => (
  <UnsavedChangesContext.Provider value={contextValue}>{children}</UnsavedChangesContext.Provider>
)

const TestComponent = ({ dirty, message }: { dirty: boolean; message?: string }) => {
  useUnsavedChangesPrompt(dirty, { message })
  return null
}

describe('useUnsavedChangesPrompt', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('updates dirty state and message handlers when dirty', () => {
    const { value, setDirty, setMessage, resetMessage } = createContextMock()

    const { rerender, unmount } = render(
      <Wrapper contextValue={value}>
        <TestComponent dirty={true} message="custom warning" />
      </Wrapper>
    )

    expect(setDirty).toHaveBeenCalledWith(true)
    expect(setMessage).toHaveBeenCalledWith('custom warning')

    rerender(
      <Wrapper contextValue={value}>
        <TestComponent dirty={false} message="custom warning" />
      </Wrapper>
    )

    expect(setDirty).toHaveBeenCalledWith(false)

    unmount()
    expect(resetMessage).toHaveBeenCalled()
  })

  it('adds and removes beforeunload handler only when dirty', () => {
    const addListenerSpy = jest.spyOn(window, 'addEventListener')
    const removeListenerSpy = jest.spyOn(window, 'removeEventListener')
    const { value } = createContextMock()

    const { rerender } = render(
      <Wrapper contextValue={value}>
        <TestComponent dirty={true} />
      </Wrapper>
    )

    expect(addListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))

    rerender(
      <Wrapper contextValue={value}>
        <TestComponent dirty={false} />
      </Wrapper>
    )

    expect(removeListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })

  it('prevents unload and sets returnValue when handler fires', () => {
    const { value } = createContextMock()
    let beforeUnloadHandler: ((event: BeforeUnloadEvent) => void) | undefined

    jest
      .spyOn(window, 'addEventListener')
      .mockImplementation(
        (event: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
          if (event === 'beforeunload') {
            beforeUnloadHandler = handler as (event: BeforeUnloadEvent) => void
            return
          }
          return window.addEventListener(event, handler, options)
        }
      )
    jest
      .spyOn(window, 'removeEventListener')
      .mockImplementation(
        (event: string, handler: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => {
          if (event === 'beforeunload' && beforeUnloadHandler === handler) {
            beforeUnloadHandler = undefined
            return
          }
          return window.removeEventListener(event, handler, options)
        }
      )

    render(
      <Wrapper contextValue={value}>
        <TestComponent dirty={true} />
      </Wrapper>
    )

    expect(beforeUnloadHandler).toBeDefined()

    const event = {
      preventDefault: jest.fn<(this: void) => void>(),
      returnValue: '',
    } as unknown as BeforeUnloadEvent
    const preventDefaultSpy = event.preventDefault as jest.MockedFunction<() => void>

    act(() => {
      beforeUnloadHandler?.(event)
    })

    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(event.returnValue).toBe(value.message)
  })
})
