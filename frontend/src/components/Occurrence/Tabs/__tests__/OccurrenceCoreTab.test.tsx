import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { OccurrenceCoreTab } from '../OccurrenceCoreTab'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  useDetailContext: jest.fn(),
}))

const capturedArrayFrameProps: Array<{ title: string; array: Array<Array<string>> }> = []

jest.mock('@/components/DetailView/common/tabLayoutHelpers', () => ({
  HalfFrames: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ArrayFrame: (props: { title: string; array: Array<Array<string>> }) => {
    capturedArrayFrameProps.push(props)
    return <div data-testid="array-frame" />
  },
}))

const mockUseDetailContext = useDetailContext as jest.MockedFunction<typeof useDetailContext>

describe('OccurrenceCoreTab', () => {
  beforeEach(() => {
    capturedArrayFrameProps.length = 0
    mockUseDetailContext.mockReturnValue({
      data: {
        lid: 1,
        species_id: 2,
        genus_name: 'Genus',
        species_name: 'species',
        id_status: 'ok',
        orig_entry: 'orig',
        source_name: 'src',
        nis: 10,
        pct: 50,
        quad: 1,
        mni: 2,
        qua: 'a',
        body_mass: 100,
      },
    } as never)
  })

  it('uses Quantity label with mapped values and places source fields in Identification', () => {
    render(<OccurrenceCoreTab />)

    const [identification, counts, size] = capturedArrayFrameProps

    expect(identification?.title).toBe('Identification')
    expect(identification?.array.some(row => row[0] === 'Original entry')).toBe(true)
    expect(identification?.array.some(row => row[0] === 'Source name')).toBe(true)

    expect(counts?.title).toBe('Occurrence counts')
    expect(counts?.array.some(row => row[0] === 'Quantity' && row[1] === 'Abundant')).toBe(true)

    expect(size?.title).toBe('Size')
    expect(size?.array).toEqual([['Body mass', '100']])
  })
})
