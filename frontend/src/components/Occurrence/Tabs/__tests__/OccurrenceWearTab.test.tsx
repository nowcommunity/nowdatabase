import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { OccurrenceWearTab } from '../OccurrenceWearTab'

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

const wearData = {
  mesowear: 'bil',
  mw_or_high: 1,
  mw_or_low: 2,
  mw_cs_sharp: 3,
  mw_cs_round: 4,
  mw_cs_blunt: 5,
  microwear: 'pit_dom',
  mw_scale_min: 1,
  mw_scale_max: 5,
  mw_value: 3,
}

describe('OccurrenceWearTab', () => {
  beforeEach(() => {
    capturedArrayFrameProps.length = 0
  })

  it('renders read-mode values', () => {
    mockUseDetailContext.mockReturnValue({
      data: wearData,
      editData: wearData,
      mode: { read: true },
      textField: jest.fn(),
      dropdown: jest.fn(),
    } as never)

    render(<OccurrenceWearTab />)

    const [mesowearFrame, microwearFrame] = capturedArrayFrameProps

    expect(mesowearFrame?.array.some(row => row[0] === 'Mesowear' && row[1] === 'Abrasion-dominated')).toBe(true)
    expect(microwearFrame?.array.some(row => row[0] === 'Microwear' && row[1] === 'Pits predominant')).toBe(true)
  })

  it('renders editable dropdowns for mesowear and microwear in edit mode', () => {
    const dropdown = jest.fn((_field: string) => 'dropdown-control')
    const textField = jest.fn((_field: string) => 'text-control')

    mockUseDetailContext.mockReturnValue({
      data: wearData,
      editData: wearData,
      mode: { read: false },
      textField,
      dropdown,
    } as never)

    render(<OccurrenceWearTab />)

    const [mesowearFrame, microwearFrame] = capturedArrayFrameProps

    expect(dropdown).toHaveBeenCalledWith('mesowear', expect.any(Array), 'Mesowear')
    expect(dropdown).toHaveBeenCalledWith('microwear', expect.any(Array), 'Microwear')
    expect(mesowearFrame?.array.some(row => row[0] === 'Mesowear' && row[1] === 'dropdown-control')).toBe(true)
    expect(microwearFrame?.array.some(row => row[0] === 'Microwear' && row[1] === 'dropdown-control')).toBe(true)
    expect(textField).toHaveBeenCalledWith('mw_scale_min', { type: 'number' })
    expect(textField).toHaveBeenCalledWith('mw_scale_max', { type: 'number' })
    expect(textField).toHaveBeenCalledWith('mw_value', { type: 'number' })
  })
})
