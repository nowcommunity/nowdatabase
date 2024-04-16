import { Card, Typography, Box } from '@mui/material'
import { ReactNode } from 'react'
import { useDetailContext } from '../hooks'

export const Grouped = ({ title, children }: { title?: string; children: ReactNode }) => {
  return (
    <Card style={{ margin: '1em', padding: '10px' }} variant="outlined">
      {title && (
        <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
      )}
      <Box marginTop="15px">{children}</Box>
    </Card>
  )
}

export const DataValue = <T extends object>({
  field,
  editElement: getEditElement,
}: {
  field: keyof T
  editElement: (fieldName: keyof T) => ReactNode
}) => {
  const { data, mode } = useDetailContext<T>()
  if (mode === 'edit') {
    return getEditElement(field)
  }
  return data[field]
}
