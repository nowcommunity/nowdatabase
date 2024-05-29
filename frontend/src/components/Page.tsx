/* eslint-disable react-refresh/only-export-components */
import { useParams } from 'react-router-dom'
import { ReactNode, createContext, useContext, useState, Context } from 'react'

export type PageContextType<T> = {
  idList: string[]
  setIdList: (ids: string[]) => void
  idFieldName: string
  viewName: string
  tableUrl: string
  setTableUrl: (newUrl: string) => void
  createTitle: (data: T) => string
}

export const PageContext = createContext<PageContextType<unknown>>(null!)

export const PageContextProvider = <T extends object>({
  children,
  idFieldName,
  viewName,
  createTitle,
}: {
  children: ReactNode | ReactNode[]
  idFieldName: string
  viewName: string
  createTitle: (data: T) => string
}) => {
  const [idList, setIdList] = useState<string[]>([])
  const [tableUrl, setTableUrl] = useState<string>(`/${viewName}`)

  return (
    <PageContext.Provider
      value={{
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

export const Page = <T extends Record<string, unknown>>({
  tableView,
  detailView,
  idFieldName,
  viewName,
  createTitle,
}: {
  tableView: ReactNode
  detailView: ReactNode
  idFieldName: keyof T
  viewName: string
  createTitle: (data: T) => string
}) => {
  const { id } = useParams()
  return (
    <PageContextProvider<T> idFieldName={idFieldName as string} viewName={viewName} createTitle={createTitle}>
      {id ? detailView : tableView}
    </PageContextProvider>
  )
}
