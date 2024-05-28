import { useParams } from 'react-router-dom'
import { ReactNode, createContext, useState } from 'react'

export type PageContextType<T> = {
  idList: string[]
  setIdList: (ids: string[]) => void
  idFieldName: keyof T
  viewName: string
  tableUrl: string
  setTableUrl: (newUrl: string) => void
}

export const PageContext = createContext<PageContextType<{ [key: string | number | symbol]: unknown }>>({
  idFieldName: null!,
  idList: [],
  setIdList: () => {},
  viewName: null!,
  tableUrl: '',
  setTableUrl: () => {},
})

export const PageContextProvider = <T extends object>({
  children,
  idFieldName,
  viewName,
}: {
  children: ReactNode | ReactNode[]
  idFieldName: keyof T
  viewName: string
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
      }}
    >
      {children}
    </PageContext.Provider>
  )
}

export const Page = <T extends object>({
  tableView,
  detailView,
  idFieldName,
  viewName,
}: {
  tableView: ReactNode
  detailView: ReactNode
  idFieldName: keyof T
  viewName: string
}) => {
  const { id } = useParams()
  return (
    <PageContextProvider<T> idFieldName={idFieldName} viewName={viewName}>
      {id ? detailView : tableView}
    </PageContextProvider>
  )
}
