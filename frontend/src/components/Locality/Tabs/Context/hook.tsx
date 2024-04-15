import { Context, useContext } from 'react'
import { DetailContext, DetailContextType } from './DetailContext'

export const useDetailContext = <T,>() => {
  const detailContext = useContext<DetailContextType<T>>(DetailContext as unknown as Context<DetailContextType<T>>)
  if (!detailContext) throw new Error('detailContext lacking provider')
  return detailContext
}
