import { ReactNode, createContext } from 'react'

/* 
  These correspond to actions that can be done in a field.
*/
export type EditingActionType = ['edited', 'added', 'deleted']
export type EditingAction = {
  field: string // The field that was edited
  action: EditingActionType
  value: unknown
}

export type ModeType = 'read' | 'new' | 'edit'

export type DetailContextType<T> = {
  data: T
  mode: ModeType
  actions: EditingAction[]
}

const initialMode = {
  mode: 'read' as ModeType,
  actions: [] as EditingAction[],
  data: null,
}

export const DetailContext = createContext<DetailContextType<unknown>>(initialMode)

export const DetailContextProvider = <T,>({
  children,
  contextState,
}: {
  children: ReactNode | ReactNode[]
  contextState: DetailContextType<T>
}) => {
  return <DetailContext.Provider value={{ ...contextState }}>{children}</DetailContext.Provider>
}
