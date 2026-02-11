import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react'
import { TeethTab } from '@/components/Species/Tabs/TeethTab'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import type { EditDataType, SpeciesDetailsType } from '@/shared/types'

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

const getNormalizedScore = () => {
  const mesowearFrame = capturedArrayFrameProps.find(call =>
    (call.array ?? []).some(([label]) => label === 'Normalized score')
  )
  const normalizedScoreRow = (mesowearFrame?.array ?? []).find(([label]) => label === 'Normalized score')
  return normalizedScoreRow?.[1]
}

describe('TeethTab mesowear score', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    capturedArrayFrameProps.length = 0
  })

  it('renders normalized score using shared utility output', () => {
    mockUseDetailContext.mockReturnValue({
      data: {
        mw_scale_min: 1,
        mw_scale_max: 5,
        mw_value: 3,
      } as SpeciesDetailsType,
      editData: {
        mw_scale_min: 1,
        mw_scale_max: 5,
        mw_value: 3,
      } as EditDataType<SpeciesDetailsType>,
      dropdown: jest.fn(() => <div />),
      textField: jest.fn(() => <div />),
    } as never)

    render(<TeethTab />)

    expect(getNormalizedScore()).toBe('50.00')
  })

  it('uses editData values so score updates while editing', () => {
    mockUseDetailContext.mockReturnValue({
      data: {
        mw_scale_min: 1,
        mw_scale_max: 5,
        mw_value: 3,
      } as SpeciesDetailsType,
      editData: {
        mw_scale_min: 2,
        mw_scale_max: 6,
        mw_value: 2,
      } as EditDataType<SpeciesDetailsType>,
      dropdown: jest.fn(() => <div />),
      textField: jest.fn(() => <div />),
    } as never)

    render(<TeethTab />)

    expect(getNormalizedScore()).toBe('0.00')
  })
})
