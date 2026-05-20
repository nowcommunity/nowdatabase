import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Card, Typography, Box, Divider, IconButton, Tooltip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { isValidElement, ReactNode } from 'react'
import { useDetailContext } from '../Context/DetailContext'
import { EditDataType } from '@/shared/types'
import { getFieldInfoText } from '@/shared/fieldInfo'

const getFieldFromNode = (node: ReactNode): string | undefined => {
  if (!isValidElement(node)) return undefined
  const props = node.props as { field?: unknown }
  return typeof props.field === 'string' ? props.field : undefined
}

const FieldLabel = ({ label, field }: { label: string; field?: string }) => {
  const fieldInfo = field ? getFieldInfoText(field) : undefined

  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', minWidth: 0 }}>
      <Box component="span" sx={{ fontWeight: 700, overflowWrap: 'anywhere', whiteSpace: 'normal' }}>
        {label}
      </Box>
      {fieldInfo && (
        <Tooltip title={fieldInfo} placement="top" arrow>
          <IconButton
            aria-label={`Field information for ${label}`}
            size="small"
            sx={{ ml: 0.5, p: 0.25, color: 'text.secondary', flexShrink: 0 }}
          >
            <HelpOutlineIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

export const ArrayToTable = ({ array, half }: { array: Array<Array<ReactNode>>; half?: boolean }) => {
  const maxRowLength = Math.max(...array.map(row => row.length))
  const width = half ? 12 / maxRowLength : Math.min(12 / maxRowLength, 4)
  const getCellWidth = (row: number, index: number) => {
    if (index === 1 && array[row].length === 2) return 12 - width
    return width
  }
  return (
    <Grid container direction="column">
      {array.map((row, rowIndex) => (
        <Grid key={rowIndex} container direction="row" size={12} minHeight="2.5em" alignItems="stretch">
          {row.map((item, index) => (
            <Grid
              key={index}
              size={getCellWidth(rowIndex, index)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left',
                minWidth: 0,
                minHeight: '2.5em',
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                borderRight: '1px solid rgba(224, 224, 224, 1)',
              }}
              padding="5px"
            >
              {typeof item === 'string' ? <FieldLabel label={item} field={getFieldFromNode(row[index + 1])} /> : item}
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
    const multiplier = parseInt('1'.padEnd(round + 1, '0'))
    if (value.toString().split('.')[1]?.length > round)
      return parseFloat((Math.floor(value * multiplier) / multiplier).toFixed(round))
    return value
  }
  return getValue(displayValue ?? (data[field as keyof T] as ReactNode))
}
