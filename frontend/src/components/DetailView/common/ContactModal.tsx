import { Box, Button, Modal } from '@mui/material'
import { useState } from 'react'
import { modalStyle } from './misc'

export const ContactModal = ({
  buttonText,
  onSend,
  subject,
}: {
  buttonText: string
  onSend: () => void
  subject: string
}) => {
  const [open, setOpen] = useState(false)

  const closeWithSend = async () => {
    // TODO
  }

  return (
    <Box>
      <Button onClick={() => setOpen(true)} variant="contained" sx={{ marginBottom: '1em' }}>
        {buttonText}
      </Button>
      <Modal open={open} aria-labelledby={`modal-${buttonText}`} aria-describedby={`modal-${buttonText}`}>
        <Box sx={{ ...modalStyle }}>
          <Box marginBottom="2em" marginTop="1em">
            Subject:
            {subject}
          </Box>
          <Button variant="contained" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button sx={{ marginRight: '0.5em' }} variant="contained" onClick={() => void closeWithSend()}>
            Send
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}
