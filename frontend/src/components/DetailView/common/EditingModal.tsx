import { Box, Button, Modal } from '@mui/material'
import { ReactNode, useState } from 'react'

/* 
  buttonText = Text for the button that opens modal
  children = Content of modal
  onSave = If defined, the modal will have a separate saving button.
           onSave is a function, that will return true or false, depending
           on if we want to proceed with closing the form (return false to cancel closing)
*/
export const EditingModal = ({
  buttonText,
  children,
  onSave,
}: {
  buttonText: string
  children: ReactNode | ReactNode[]
  onSave?: () => Promise<boolean>
}) => {
  const [open, setOpen] = useState(false)
  const closeWithSave = async () => {
    if (!onSave) return
    const close = await onSave()
    if (!close) return
    setOpen(false)
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    maxHeight: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    overflow: 'auto',
    boxShadow: 24,
    p: 4,
  }

  return (
    <Box>
      <Button onClick={() => setOpen(true)} variant="contained" sx={{ marginBottom: '1em' }}>
        {buttonText}
      </Button>
      <Modal open={open} aria-labelledby={`modal-${buttonText}`} aria-describedby={`modal-${buttonText}`}>
        <Box sx={{ ...modalStyle }}>
          <Box marginBottom="2em" marginTop="1em">
            {' '}
            {children}
          </Box>
          {onSave && <Button onClick={() => void closeWithSave()}>Save</Button>}
          <Button onClick={() => setOpen(false)}>{onSave ? 'Cancel' : 'Close'}</Button>
        </Box>
      </Modal>
    </Box>
  )
}
