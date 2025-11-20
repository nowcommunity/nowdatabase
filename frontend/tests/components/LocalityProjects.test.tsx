import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ProjectTab } from '@/components/Locality/Tabs/ProjectTab'
import { DetailContext, type DetailContextType, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import type { EditDataType, Editable, LocalityDetailsType, Project } from '@/shared/types'
import { PageContext, type PageContextType } from '@/components/Page'

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
}))

jest.mock('@/components/DetailView/common/EditableTable', () => ({
  EditableTable: () => <div data-testid="editable-table" />,
}))

jest.mock('@/util/config', () => ({
  ENV: 'dev',
  BACKEND_URL: 'http://localhost',
  ENABLE_WRITE: true,
}))

const selectFirstProjectButtonText = 'mock-select-project'
const selectingTableMock = jest.fn()

jest.mock('@/components/DetailView/common/SelectingTable', () => ({
  SelectingTable: (props: { buttonText: string; data?: Project[]; editingAction?: (project: Project) => void }) => {
    selectingTableMock(props)
    return (
      <button type="button" onClick={() => props.data && props.data[0] && props.editingAction?.(props.data[0])}>
        {selectFirstProjectButtonText}
      </button>
    )
  },
}))

const mockUseGetAllProjectsQuery = jest.fn()
jest.mock('@/redux/projectReducer', () => ({
  useGetAllProjectsQuery: (...args: unknown[]) => mockUseGetAllProjectsQuery(...args),
}))

const createDetailContextValue = (overrides: Partial<DetailContextType<LocalityDetailsType>> = {}) =>
  ({
    data: { now_plr: [] } as unknown as LocalityDetailsType,
    mode: modeOptionToMode.edit,
    setMode: () => {},
    editData: { lid: 1, now_plr: [] } as unknown as EditDataType<LocalityDetailsType>,
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

const createPageContextValue = (overrides: Partial<PageContextType<LocalityDetailsType>> = {}) =>
  ({
    idList: [],
    setIdList: () => {},
    idFieldName: 'lid',
    viewName: 'locality',
    previousTableUrls: [],
    setPreviousTableUrls: () => {},
    createTitle: () => '',
    createSubtitle: () => '',
    editRights: { edit: true },
    sqlLimit: 10,
    sqlOffset: 0,
    sqlColumnFilters: [],
    sqlOrderBy: [],
    setSqlLimit: () => {},
    setSqlOffset: () => {},
    setSqlColumnFilters: () => {},
    setSqlOrderBy: () => {},
    ...overrides,
  }) as PageContextType<LocalityDetailsType>

const renderProjectTab = ({
  detailOverrides,
  pageOverrides,
}: {
  detailOverrides?: Partial<DetailContextType<LocalityDetailsType>>
  pageOverrides?: Partial<PageContextType<LocalityDetailsType>>
} = {}) => {
  const contextValue = createDetailContextValue(detailOverrides)
  const pageContextValue = createPageContextValue(pageOverrides)

  render(
    <PageContext.Provider value={pageContextValue as unknown as PageContextType<unknown>}>
      <DetailContext.Provider value={contextValue as unknown as DetailContextType<unknown>}>
        <ProjectTab />
      </DetailContext.Provider>
    </PageContext.Provider>
  )

  return contextValue.setEditData
}

const buildProject = (overrides: Partial<Project> = {}): Project =>
  ({
    pid: 99,
    proj_code: 'NOW',
    proj_name: 'Now Project',
    contact: 'Jane',
    proj_status: 'active',
    ...overrides,
  }) as Project

beforeEach(() => {
  selectingTableMock.mockClear()
  mockUseGetAllProjectsQuery.mockReset()
})

describe('ProjectTab', () => {
  it('appends a project to edit data when the selector picks one', async () => {
    const sampleProject = buildProject()
    mockUseGetAllProjectsQuery.mockReturnValue({ data: [sampleProject], isError: false })
    const setEditData = jest.fn()

    renderProjectTab({
      detailOverrides: {
        setEditData: setEditData as unknown as DetailContextType<LocalityDetailsType>['setEditData'],
        editData: { lid: 1, now_plr: [] } as unknown as EditDataType<LocalityDetailsType>,
      },
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: selectFirstProjectButtonText }))

    expect(setEditData).toHaveBeenCalledTimes(1)
    const updated = setEditData.mock.calls[0][0] as EditDataType<LocalityDetailsType>
    const projects = updated.now_plr as Editable<Project>[]
    expect(projects.at(-1)?.pid).toEqual(sampleProject.pid)
    expect(projects.at(-1)?.rowState).toEqual('new')
  })

  it('displays a fetch error when loading projects fails', () => {
    mockUseGetAllProjectsQuery.mockReturnValue({ data: undefined, isError: true })
    renderProjectTab()
    expect(screen.getByText(/unable to fetch projects/i)).toBeTruthy()
  })

  it('hides the selector when the user lacks edit permissions', () => {
    mockUseGetAllProjectsQuery.mockReturnValue({ data: [buildProject()], isError: false })
    renderProjectTab({ pageOverrides: { editRights: {} } })
    expect(screen.queryByRole('button', { name: selectFirstProjectButtonText })).toBeNull()
  })
})
