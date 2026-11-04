import { describe, expect, it, jest } from '@jest/globals'
import { act, render, screen, waitFor } from '@testing-library/react'

type MapProps = { loadLayers?: boolean; onOpen?: () => void }

const mockLocalitiesMap = jest.fn((props: MapProps) => (
  <div data-testid="real-map" data-layers={`${props.loadLayers}`} />
))

jest.mock('../../src/components/Map/LocalitiesMap', () => ({
  LocalitiesMap: (props: MapProps) => mockLocalitiesMap(props),
}))

describe('LazyLocalitiesMap', () => {
  it('shows the base map first and loads layers only after the map is opened', async () => {
    const { LazyLocalitiesMap } = await import('../../src/components/Map/LazyLocalitiesMap')
    render(<LazyLocalitiesMap localities={[]} isFetching={false} />)

    await waitFor(() => expect(screen.getByTestId('real-map').getAttribute('data-layers')).toBe('false'))

    const onOpen = mockLocalitiesMap.mock.calls[0][0].onOpen
    act(() => onOpen?.())

    await waitFor(() => expect(screen.getByTestId('real-map').getAttribute('data-layers')).toBe('true'))
  })
})
