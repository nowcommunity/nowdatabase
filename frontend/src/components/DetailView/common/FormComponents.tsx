import { Card, Typography, Box, Grid, Divider } from '@mui/material'
import { ReactNode } from 'react'
import { useDetailContext } from '../hooks'

export const ArrayToTable = ({ array }: { array: Array<Array<ReactNode>> }) => (
  <Grid container direction="row">
    {array.map((row, index) => (
      <Grid key={index} container direction="row" height="2.5em">
        {row.map((item, index) => (
          <Grid key={index} item xs={index === 0 ? 2 : Math.min((12 / row.length), 4)} padding="5px">
            {typeof item === 'string' ? <b>{item}</b> : item}
          </Grid>
        ))}
      </Grid>
    ))}
  </Grid>
)

export const ArrayFrame = ({ array, title }: { array: Array<Array<ReactNode>>; title: string }) => (
  <Grouped title={title}>
    <ArrayToTable array={array} />
  </Grouped>
)

export const Grouped = ({ title, children }: { title?: string; children: ReactNode }) => {
  return (
    <Card style={{ margin: '1em', padding: '10px', paddingBottom: '15px', backgroundColor: 'white' }}>
      {title && (
        <>
          <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Divider />
        </>
      )}
      <Box marginTop="15px">{children}</Box>
    </Card>
  )
}

export const DataValue = <T extends object>({
  field,
  EditElement,
}: {
  field: keyof T
  EditElement: ReactNode
}) => {
  const { data, mode } = useDetailContext<T>()
  if (mode === 'edit') {
    return EditElement
  }
  return data[field]
}
