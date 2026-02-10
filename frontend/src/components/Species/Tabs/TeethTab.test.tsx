import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react'
import { TeethTab } from '@/components/Species/Tabs/TeethTab'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import type { SpeciesDetailsType } from '@/shared/types'

jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  useDetailContext: jest.fn(),
}))

type ArrayFrameProps = {
  array?: Array<[string, unknown]>
}

const capturedArrayFrameProps: ArrayFrameProps[] = []
const arrayFrameMock = jest.fn<(props: ArrayFrameProps) => JSX.Element>()
arrayFrameMock.mockImplementation(props => {
  capturedArrayFrameProps.push(props)
  return <div data-testid="array-frame" />
})

jest.mock('@/components/DetailView/common/tabLayoutHelpers', () => ({
  ArrayFrame: (props: ArrayFrameProps) => arrayFrameMock(props),
  HalfFrames: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

const mockUseDetailContext = useDetailContext as jest.MockedFunction<typeof useDetailContext>

describe('TeethTab mesowear score', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedArrayFrameProps.length = 0

    mockUseDetailContext.mockReturnValue({
      data: {
        mw_scale_min: 1,
        mw_scale_max: 5,
        mw_value: 3,
      } as SpeciesDetailsType,
      dropdown: jest.fn(() => <div />),
      textField: jest.fn(() => <div />),
    } as never)
  })

  it('renders normalized score using shared utility output', () => {
    render(<TeethTab />)

    const mesowearFrame = capturedArrayFrameProps.find(call =>
      (call.array ?? []).some(([label]) => label === 'Normalized score')
    )

    expect(mesowearFrame).toBeDefined()

    const normalizedScoreRow = (mesowearFrame?.array ?? []).find(([label]) => label === 'Normalized score')
    expect(normalizedScoreRow?.[1]).toBe('50.00')
  })
})
