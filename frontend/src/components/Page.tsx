/* eslint-disable react-refresh/only-export-components */
import { useParams } from 'react-router-dom'
import { ReactNode, createContext, useContext, useState, Context } from 'react'
import { useUser } from '@/hooks/user'
import { Box } from '@mui/material'
import { Role } from '@/types'
import { UserState } from '@/redux/userReducer'
import { ENABLE_WRITE } from '@/util/config'

export type PageContextType<T> = {
  idList: string[]
  setIdList: (ids: string[]) => void
  idFieldName: string
  viewName: string
  tableUrl: string
  setTableUrl: (newUrl: string) => void
  createTitle: (data: T) => string
  editRights: EditRights
}

export const PageContext = createContext<PageContextType<unknown>>(null!)

export const PageContextProvider = <T extends object>({
  children,
  idFieldName,
  viewName,
  createTitle,
  editRights,
}: {
  children: ReactNode | ReactNode[]
  idFieldName: string
  viewName: string
  createTitle: (data: T) => string
  editRights: EditRights
}) => {
  const [idList, setIdList] = useState<string[]>([])
  const [tableUrl, setTableUrl] = useState<string>(`/${viewName}`)

  return (
    <PageContext.Provider
      value={{
        editRights,
        idList,
        idFieldName,
        setIdList: (newIdList: string[]) => setIdList(newIdList),
        viewName,
        tableUrl,
        setTableUrl: (newUrl: string) => setTableUrl(newUrl),
        createTitle: (data: unknown) => createTitle(data as T),
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
  allowedRoles,
  getEditRights,
}: {
  tableView: ReactNode
  detailView: ReactNode
  idFieldName: keyof T
  viewName: string
  createTitle: (data: T) => string
  allowedRoles?: Role[]
  getEditRights: (user: UserState, id: string | number) => EditRights
}) => {
  const { id } = useParams()
  const user = useUser()
  const editRights = ENABLE_WRITE && user ? getEditRights(user, id!) : {}
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Box>Your user is not authorized to view this page.</Box>
  return (
    <PageContextProvider<T>
      editRights={editRights}
      idFieldName={idFieldName as string}
      viewName={viewName}
      createTitle={createTitle}
    >
      {id ? detailView : tableView}
    </PageContextProvider>
  )
}
