import { Card, Typography, Box, Grid, Divider } from '@mui/material'
import { ReactNode } from 'react'
import { useDetailContext } from '../Context/DetailContext'
import { EditDataType } from '@/backendTypes'

export const ArrayToTable = ({ array, half }: { array: Array<Array<ReactNode>>; half?: boolean }) => {
  const maxRowLength = Math.max(...array.map(row => row.length))
  const width = half ? 12 / maxRowLength : Math.min(12 / maxRowLength, 4)
  const getCellWidth = (row: number, index: number) => {
    if (index === 1 && array[row].length === 2) return 12 - width
    return width
  }
  return (
    <Grid container direction="row">
      {array.map((row, rowIndex) => (
        <Grid key={rowIndex} container direction="row" minHeight="2.5em">
          {row.map((item, index) => (
            <Grid
              key={index}
              item
              xs={getCellWidth(rowIndex, index)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left',
                height: '100%',
              }}
              padding="5px"
            >
              {typeof item === 'string' ? <b>{item}</b> : item}
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  )
}

export const ArrayFrame = ({
  array,
  title,
  half,
}: {
  array: Array<Array<ReactNode>>
  title: string
  half?: boolean
}) => (
  <Grouped title={title}>
    <ArrayToTable half={half} array={array} />
  </Grouped>
)

export const HalfFrames = ({ children }: { children: [ReactNode, ReactNode] }) => {
  const ArrayFrameStyle = {
    flexGrow: 1,
    flexBasis: '50%', // Each item should start at 50% of the parent's width
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
      {children.map((child, index) => (
        <div key={index} style={ArrayFrameStyle}>
          {child}
        </div>
      ))}
    </div>
  )
}

export const Grouped = ({ title, children }: { title?: string; children: ReactNode }) => {
  const styles = {
    padding: '10px',
    paddingBottom: '15px',
    backgroundColor: 'white',
    margin: '0em',
  }

  return (
    <Card style={styles}>
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
  displayValue,
  round,
}: {
  field: keyof EditDataType<T>
  EditElement: ReactNode
  displayValue?: ReactNode | null
  round?: number
}) => {
  const { data, mode } = useDetailContext<T>()
  if (!mode.read) {
    return EditElement
  }
  const getValue = (value: ReactNode) => {
    if (round === undefined || typeof value !== 'number') {
      return value
    }
    if (value.toString().split('.')[1]?.length > round)
      return parseFloat((Math.floor(value * 100) / 100).toFixed(round))
    return value
  }
  return getValue(displayValue ?? (data[field as keyof T] as ReactNode))
}
