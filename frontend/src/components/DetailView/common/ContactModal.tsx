import { Box, Button, Modal } from '@mui/material'
import { ReactNode, useState } from 'react'
import { modalStyle } from './misc'
import EmailIcon from '@mui/icons-material/Email'

export const ContactModal = ({
  buttonText,
  onSend,
  children,
}: {
  buttonText: string
  onSend: () => Promise<boolean>
  children: ReactNode
}) => {
  const [open, setOpen] = useState(false)

  const closeWithSend = async () => {
    const close = await onSend()
    if (!close) return
    setOpen(false)
  }

  return (
    <Box>
      <Button onClick={() => setOpen(true)} variant="outlined" startIcon={<EmailIcon />} className="button">
        {buttonText}
      </Button>
      <Modal
        open={open}
        aria-labelledby={`modal-${buttonText}`}
        aria-describedby={`modal-${buttonText}`}
        className="modal"
      >
        <Box sx={{ ...modalStyle }} className="modal-content">
          <Box marginBottom="2em" marginTop="1em">
            {' '}
            {children}
          </Box>
          <Button sx={{ marginRight: '0.5em' }} variant="contained" onClick={() => void closeWithSend()}>
            Send Email
          </Button>
          <Button variant="contained" onClick={() => setOpen(false)}>
            {'Cancel'}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}
