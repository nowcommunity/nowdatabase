/* eslint-disable react-refresh/only-export-components */
import { useParams } from 'react-router-dom'
import { ReactNode, createContext, useContext, useState, Context } from 'react'
import { useUser } from '@/hooks/user'
import { Box } from '@mui/material'
import { Role } from '@/shared/types'
import { UserState } from '@/redux/userReducer'
import { ENABLE_WRITE } from '@/util/config'
import { MRT_ColumnFiltersState, MRT_SortingState } from 'material-react-table'
import { defaultPagination } from '@/common'

export type PageContextType<T> = {
  idList: string[]
  setIdList: (ids: string[]) => void
  idFieldName: string
  viewName: string
  previousTableUrls: string[]
  setPreviousTableUrls: (newPreviousTableUrls: string[]) => void
  createTitle: (data: T) => string
  createSubtitle: (data: T) => string
  editRights: EditRights
  sqlLimit: number
  sqlOffset: number
  sqlColumnFilters: MRT_ColumnFiltersState
  sqlOrderBy: MRT_SortingState
  setSqlLimit: (newSqlLimit: number) => void
  setSqlOffset: (newSqlOffset: number) => void
  setSqlColumnFilters: (newSqlColumnFilters: MRT_ColumnFiltersState) => void
  setSqlOrderBy: (newSqlOrderBy: MRT_SortingState) => void
}

export const PageContext = createContext<PageContextType<unknown>>(null!)

export const PageContextProvider = <T extends object>({
  children,
  idFieldName,
  viewName,
  createTitle,
  createSubtitle,
  editRights,
}: {
  children: ReactNode | ReactNode[]
  idFieldName: string
  viewName: string
  createTitle: (data: T) => string
  createSubtitle: (data: T) => string
  editRights: EditRights
}) => {
  const [idList, setIdList] = useState<string[]>([])
  const [previousTableUrls, setPreviousTableUrls] = useState<string[]>([])
  // TODO: replace with some default values from variables
  const [sqlLimit, setSqlLimit] = useState<number>(defaultPagination.pageSize)
  const [sqlOffset, setSqlOffset] = useState<number>(0)
  const [sqlColumnFilters, setSqlColumnFilters] = useState<MRT_ColumnFiltersState>([])
  const [sqlOrderBy, setSqlOrderBy] = useState<MRT_SortingState>([])

  return (
    <PageContext.Provider
      value={{
        editRights,
        idList,
        idFieldName,
        setIdList: (newIdList: string[]) => setIdList(newIdList),
        viewName,
        previousTableUrls,
        setPreviousTableUrls,
        createTitle: (data: unknown) => createTitle(data as T),
        createSubtitle: (data: unknown) => createSubtitle(data as T),
        sqlLimit,
        sqlOffset,
        sqlColumnFilters,
        sqlOrderBy,
        setSqlLimit: (newSqlLimit: number) => setSqlLimit(newSqlLimit),
        setSqlOffset: (newSqlOffset: number) => setSqlOffset(newSqlOffset),
        setSqlColumnFilters: (newSqlColumnFilters: MRT_ColumnFiltersState) => setSqlColumnFilters(newSqlColumnFilters),
        setSqlOrderBy: (newSqlOrderBy: MRT_SortingState) => setSqlOrderBy(newSqlOrderBy),
      }}
    >
      {children}
    </PageContext.Provider>
  )
}

export const usePageContext = <T extends object>() => {
  const pageContext = useContext<PageContextType<T>>(PageContext as unknown as Context<PageContextType<T>>)
  if (!pageContext) throw new Error('detailContext lacking provider')
  return pageContext
}

export type EditRights = { new?: true; edit?: true; delete?: true }

export const Page = <T extends Record<string, unknown>>({
  tableView,
  detailView,
  idFieldName,
  viewName,
  createTitle,
  createSubtitle,
  allowedRoles,
  getEditRights,
}: {
  tableView: ReactNode
  detailView: ReactNode
  idFieldName: keyof T
  viewName: string
  createTitle: (data: T) => string
  createSubtitle?: (data: T) => string
  allowedRoles?: Role[]
  getEditRights: (user: UserState, id: string | number) => EditRights
}) => {
  const { id } = useParams()
  const user = useUser()
  const editRights = ENABLE_WRITE && user ? getEditRights(user, id!) : {}
  if ((id === 'new' && !editRights.new) || (allowedRoles && !allowedRoles.includes(user.role)))
    return <Box>Your user is not authorized to view this page.</Box>
  return (
    <PageContextProvider<T>
      editRights={editRights}
      idFieldName={idFieldName as string}
      viewName={viewName}
      createTitle={createTitle}
      createSubtitle={createSubtitle ? createSubtitle : () => ''}
    >
      {id ? detailView : tableView}
    </PageContextProvider>
  )
}
