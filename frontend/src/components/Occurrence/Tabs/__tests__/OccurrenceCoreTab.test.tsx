import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { OccurrenceCoreTab } from '../OccurrenceCoreTab'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  useDetailContext: jest.fn(),
}))

const capturedArrayFrameProps: Array<{ title: string; array: Array<Array<unknown>> }> = []

jest.mock('@/components/DetailView/common/tabLayoutHelpers', () => ({
  HalfFrames: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ArrayFrame: (props: { title: string; array: Array<Array<unknown>> }) => {
    capturedArrayFrameProps.push(props)
    return <div data-testid="array-frame" />
  },
}))

const mockUseDetailContext = useDetailContext as jest.MockedFunction<typeof useDetailContext>

const baseOccurrence = {
  lid: 1,
  species_id: 2,
  genus_name: 'Genus',
  species_name: 'species',
  id_status: 'certain',
  orig_entry: 'orig',
  source_name: 'src',
  nis: 10,
  pct: 50,
  quad: 1,
  mni: 2,
  qua: 'a',
  body_mass: 100,
}

describe('OccurrenceCoreTab', () => {
  beforeEach(() => {
    capturedArrayFrameProps.length = 0
  })

  it('renders read-mode values with quantity labels', () => {
    mockUseDetailContext.mockReturnValue({
      data: baseOccurrence,
      editData: baseOccurrence,
      mode: { read: true },
      textField: jest.fn(),
      dropdown: jest.fn(),
    } as never)

    render(<OccurrenceCoreTab />)

    const [identification, counts, size] = capturedArrayFrameProps

    expect(identification?.title).toBe('Identification')
    expect(identification?.array.some(row => row[0] === 'Original entry' && row[1] === 'orig')).toBe(true)
    expect(identification?.array.some(row => row[0] === 'Source name' && row[1] === 'src')).toBe(true)

    expect(counts?.title).toBe('Occurrence counts')
    expect(counts?.array.some(row => row[0] === 'Quantity' && row[1] === 'Abundant')).toBe(true)

    expect(size?.title).toBe('Size')
    expect(size?.array).toEqual([['Body mass', '100']])
  })

  it('renders editable controls in edit mode including ID status and Quantity dropdowns', () => {
    const dropdown = jest.fn((_field: string) => 'dropdown-control')
    const textField = jest.fn((_field: string) => 'text-control')

    mockUseDetailContext.mockReturnValue({
      data: baseOccurrence,
      editData: baseOccurrence,
      mode: { read: false },
      textField,
      dropdown,
    } as never)

    render(<OccurrenceCoreTab />)

    const [identification, counts] = capturedArrayFrameProps

    expect(dropdown).toHaveBeenCalledWith('id_status', expect.any(Array), 'ID status')
    expect(dropdown).toHaveBeenCalledWith('qua', expect.any(Array), 'Quantity')
    expect(identification?.array.some(row => row[0] === 'ID status' && row[1] === 'dropdown-control')).toBe(true)
    expect(counts?.array.some(row => row[0] === 'Quantity' && row[1] === 'dropdown-control')).toBe(true)
    expect(textField).toHaveBeenCalledWith('orig_entry', { type: 'text' })
  })
})
