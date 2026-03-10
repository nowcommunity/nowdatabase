import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { OccurrenceIsotopeTab } from '../OccurrenceIsotopeTab'

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

const isotopeData = {
  dc13_mean: 1,
  dc13_n: 2,
  dc13_max: 3,
  dc13_min: 4,
  dc13_stdev: 5,
  do18_mean: 6,
  do18_n: 7,
  do18_max: 8,
  do18_min: 9,
  do18_stdev: 10,
}

describe('OccurrenceIsotopeTab', () => {
  beforeEach(() => {
    capturedArrayFrameProps.length = 0
  })

  it('renders editable numeric controls in edit mode', () => {
    const textField = jest.fn((_field: string) => 'number-control')

    mockUseDetailContext.mockReturnValue({
      data: isotopeData,
      editData: isotopeData,
      mode: { read: false },
      textField,
    } as never)

    render(<OccurrenceIsotopeTab />)

    expect(textField).toHaveBeenCalledWith('dc13_mean', { type: 'number' })
    expect(textField).toHaveBeenCalledWith('do18_stdev', { type: 'number' })
  })
})
