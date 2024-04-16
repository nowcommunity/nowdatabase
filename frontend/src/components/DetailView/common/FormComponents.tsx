import { Card, Typography, Box, Grid } from '@mui/material'
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
  return <b>{data[field] as ReactNode}</b>
}

export type LabeledItem = {
  label: string
  component?: ReactNode
}

export const LabeledItems = ({ items }: { items: LabeledItem[] }) => {
  return (
    <Box>
      <Grid direction="column" container rowGap={'0.4em'}>
        {items.map(item => (
          <Grid key={item.label} direction="row" container gap="2em" minHeight="2.5em">
            <Grid xs={4} item>
              <b>{item.label}</b>
            </Grid>
            <Grid xs={4} item>
              {item.component}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
