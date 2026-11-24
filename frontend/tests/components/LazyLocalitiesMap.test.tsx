import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

type MapProps = { initiallyOpen?: boolean; loadLayers?: boolean; onOpen?: () => void }

const mockLocalitiesMap = jest.fn((props: MapProps) => (
  <div data-testid="real-map" data-layers={`${props.loadLayers}`} data-open={`${props.initiallyOpen}`} />
))

jest.mock('../../src/components/Map/LocalitiesMap', () => ({
  LocalitiesMap: (props: MapProps) => mockLocalitiesMap(props),
}))

describe('LazyLocalitiesMap', () => {
  it('mounts the map immediately with loadLayers=false and collapsed, and sets loadLayers=true after opening', async () => {
    const { LazyLocalitiesMap } = await import('../../src/components/Map/LazyLocalitiesMap')
    render(<LazyLocalitiesMap localities={[]} isFetching={false} />)

    expect(mockLocalitiesMap).toHaveBeenCalled()
    expect(screen.getByTestId('real-map').getAttribute('data-layers')).toBe('false')
    expect(screen.getByTestId('real-map').getAttribute('data-open')).toBe('false')

    fireEvent.click(screen.getByRole('button', { name: 'Open map' }))

    await waitFor(() => {
      expect(screen.getByTestId('real-map').getAttribute('data-layers')).toBe('true')
      expect(screen.getByTestId('real-map').getAttribute('data-open')).toBe('true')
    })
  })
})
