import { Card, Typography, Box, Grid, Divider, Modal, Button } from '@mui/material'
import { ReactNode, useState } from 'react'
import { useDetailContext } from '../hooks'

export const ArrayToTable = ({ array }: { array: Array<Array<ReactNode>> }) => (
  <Grid container direction="row">
    {array.map((row, index) => (
      <Grid key={index} container direction="row" height="2.5em">
        {row.map((item, index) => (
          <Grid key={index} item xs={index === 0 ? 2 : Math.min(12 / row.length, 4)} padding="5px">
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

export const DataValue = <T extends object>({ field, EditElement }: { field: keyof T; EditElement: ReactNode }) => {
  const { data, mode } = useDetailContext<T>()
  if (mode === 'edit') {
    return EditElement
  }
  return data[field]
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  height: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  overflow: 'auto',
  boxShadow: 24,
  p: 4,
}

export const EditingModal = ({ buttonText, children }: { buttonText: string; children: ReactNode | ReactNode[] }) => {
  const [open, setOpen] = useState(false)

  return (
    <Box>
      <Button onClick={() => setOpen(true)}>{buttonText}</Button>
      <Modal open={open} aria-labelledby={`modal-${buttonText}`} aria-describedby={`modal-${buttonText}`}>
        <Box sx={{ ...modalStyle }}>
          <Box marginBottom="2em"> {children}</Box>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Box>
      </Modal>
    </Box>
  )
}
