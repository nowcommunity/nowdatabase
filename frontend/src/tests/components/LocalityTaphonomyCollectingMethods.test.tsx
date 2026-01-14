import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TaphonomyTab } from '@/components/Locality/Tabs/TaphonomyTab'
import { DetailContext, type DetailContextType, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import type { CollectingMethodValues, EditDataType, LocalityDetailsType } from '@/shared/types'

const selectingTableMock = jest.fn()

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
  isEqualWith: () => false,
}))

jest.mock('@/util/config', () => ({
  ENV: 'dev',
  BACKEND_URL: 'http://localhost',
  ENABLE_WRITE: true,
}))

jest.mock('@/components/DetailView/common/SelectingTable', () => ({
  SelectingTable: (props: {
    buttonText: string
    data?: CollectingMethodValues[]
    editingAction?: (method: CollectingMethodValues) => void
  }) => {
    selectingTableMock(props)
    return (
      <button type="button" onClick={() => props.data && props.data[0] && props.editingAction?.(props.data[0])}>
        {props.buttonText}
      </button>
    )
  },
}))

const mockUseGetAllCollectingMethodValuesQuery = jest.fn()

jest.mock('@/redux/collectingMethodValuesReducer', () => ({
  useGetAllCollectingMethodValuesQuery: (...args: unknown[]) => mockUseGetAllCollectingMethodValuesQuery(...args),
}))

const createDetailContextValue = (overrides: Partial<DetailContextType<LocalityDetailsType>> = {}) =>
  ({
    data: { now_coll_meth: [] } as unknown as LocalityDetailsType,
    mode: modeOptionToMode.edit,
    setMode: () => {},
    editData: { lid: 1, now_coll_meth: [] } as unknown as EditDataType<LocalityDetailsType>,
    setEditData: () => {},
    textField: () => <></>,
    bigTextField: () => <></>,
    dropdown: () => <></>,
    dropdownWithSearch: () => <></>,
    radioSelection: () => <></>,
    validator: () => ({ name: '', error: null }),
    fieldsWithErrors: {},
    setFieldsWithErrors: () => {},
    ...overrides,
  }) as DetailContextType<LocalityDetailsType>

const renderTaphonomyTab = (overrides: Partial<DetailContextType<LocalityDetailsType>> = {}) => {
  const contextValue = createDetailContextValue(overrides)

  render(
    <DetailContext.Provider value={contextValue as unknown as DetailContextType<unknown>}>
      <TaphonomyTab />
    </DetailContext.Provider>
  )

  return contextValue
}

beforeEach(() => {
  selectingTableMock.mockClear()
  mockUseGetAllCollectingMethodValuesQuery.mockReset()
})

describe('TaphonomyTab collecting methods', () => {
  it('adds a collecting method from the predefined values', async () => {
    const setEditData = jest.fn()
    const collectingMethods: CollectingMethodValues[] = [{ coll_meth_value: 'surface' }]
    mockUseGetAllCollectingMethodValuesQuery.mockReturnValue({ data: collectingMethods, isError: false })

    renderTaphonomyTab({ setEditData })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Select collecting method' }))

    expect(selectingTableMock).toHaveBeenCalled()
    expect(setEditData).toHaveBeenCalledWith({
      lid: 1,
      now_coll_meth: [{ lid: 1, coll_meth: 'surface', rowState: 'new' }],
    })
  })
})
