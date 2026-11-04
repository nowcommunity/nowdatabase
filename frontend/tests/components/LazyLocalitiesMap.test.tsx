import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const mockLocalitiesMap = jest.fn((_props: unknown) => <div data-testid="real-map" />)

jest.mock('../../src/components/Map/LocalitiesMap', () => ({
  LocalitiesMap: (props: unknown) => mockLocalitiesMap(props),
}))

describe('LazyLocalitiesMap', () => {
  it('only mounts the real map after the user opens it', async () => {
    const { LazyLocalitiesMap } = await import('../../src/components/Map/LazyLocalitiesMap')
    render(<LazyLocalitiesMap localities={[]} isFetching={false} />)

    expect(screen.queryByTestId('real-map')).toBeNull()
    expect(mockLocalitiesMap).not.toHaveBeenCalled()

    fireEvent.click(screen.getByTitle('Open map'))

    await waitFor(() => expect(screen.getByTestId('real-map')).toBeTruthy())
    expect(mockLocalitiesMap).toHaveBeenCalledWith(expect.objectContaining({ openOnMount: true }))
  })
})
