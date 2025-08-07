import { Card, Typography, Box, Divider } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { ReactNode } from 'react'
import { useDetailContext } from '../Context/DetailContext'
import { EditDataType } from '@/shared/types'

export const ArrayToTable = ({ array, half }: { array: Array<Array<ReactNode>>; half?: boolean }) => {
  const maxRowLength = Math.max(...array.map(row => row.length))
  const width = half ? 12 / maxRowLength : Math.min(12 / maxRowLength, 4)
  const getCellWidth = (row: number, index: number) => {
    if (index === 1 && array[row].length === 2) return 12 - width
    return width
  }
  return (
    <Grid container direction="row" width={'100%'}>
      {array.map((row, rowIndex) => (
        <Grid key={rowIndex} container direction="row" minHeight="2.5em" width={'100%'}>
          {row.map((item, index) => (
            <Grid
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left',
                height: '100%',
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                borderRight: '1px solid rgba(224, 224, 224, 1)',
                gap: '1em',
              }}
              padding="5px"
              size={getCellWidth(rowIndex, index)}
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
  warning,
  error,
  half,
}: {
  array: Array<Array<ReactNode>>
  title: string
  warning?: boolean
  error?: boolean
  half?: boolean
}) => (
  <Grouped title={title} warning={warning} error={error}>
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

export const Grouped = ({
  title,
  warning,
  error,
  children,
  style,
}: {
  title?: string
  warning?: boolean
  error?: boolean
  children: ReactNode
  style?: React.CSSProperties
}) => {
  const styles = style ?? {
    padding: '10px',
    paddingBottom: '15px',
    backgroundColor: 'white',
    margin: '0em',
    borderColor: error ? 'red' : warning ? 'orange' : '',
    borderRadius: error || warning ? 4 : '',
    borderStyle: error || warning ? 'none none none solid' : '',
    gap: '1em',
  }

  const titleColor = error ? 'red' : warning ? 'orange' : 'text.secondary'

  return (
    <Card style={styles}>
      {title && (
        <>
          <Typography sx={{ fontSize: 16 }} color={titleColor} gutterBottom>
            {title}
          </Typography>
          <Divider />
        </>
      )}
      <Box marginTop="15px" gap={'2em'}>
        {children}
      </Box>
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
    const multiplier = parseInt('1'.padEnd(round + 1, '0'))
    if (value.toString().split('.')[1]?.length > round)
      return parseFloat((Math.floor(value * multiplier) / multiplier).toFixed(round))
    return value
  }
  return getValue(displayValue ?? (data[field as keyof T] as ReactNode))
}
