import { TextField } from '@mui/material'
import { useContext, Context } from 'react'
import { DetailContextType, DetailContext } from './Context/DetailContext'

export const useDetailContext = <T,>() => {
  const detailContext = useContext<DetailContextType<T>>(DetailContext as unknown as Context<DetailContextType<T>>)
  if (!detailContext) throw new Error('detailContext lacking provider')
  return detailContext
}

export const useGetEditableTextField = <T,>() => {
  const { setEditData, editData } = useDetailContext<T>()
  return (fieldName: keyof T) => (
    <TextField
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        setEditData({ ...editData, [fieldName]: event?.currentTarget?.value })
      }
    />
  )
}
