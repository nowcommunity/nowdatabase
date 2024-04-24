import { FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
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
      value={editData[fieldName]}
      variant="outlined"
      size="small"
    />
  )
}

export const useGetRadioSelection = <T,>() => {
  const { setEditData, editData } = useDetailContext<T>()
  return ({ options, name, fieldName }: { options: string[], name: string, fieldName: keyof T }) => 
    (<FormControl>
      <RadioGroup
        aria-labelledby={`${name}-radio-selection`}
        name={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditData({ ...editData, [fieldName]: event?.currentTarget?.value })}
        value={editData[fieldName]}
        sx={{ display: 'flex', flexDirection: 'row' }}
        >
        {options.map(option => <FormControlLabel key={option} value={option} control={<Radio />} label={option} />)}
      </RadioGroup>
    </FormControl>
  )
}