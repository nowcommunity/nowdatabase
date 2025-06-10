import { Box, Button, Modal, Tooltip } from '@mui/material'
import { ReactNode, useState } from 'react'
import { modalStyle } from './misc'
import '../../../styles/modal.css'

/* 
  buttonText = Text for the button that opens modal
  children = Content of modal
  onSave = If defined, the modal will have a separate saving button.
           onSave is a function, that will return true or false, depending
           on if we want to proceed with closing the form (return false to cancel closing)
*/
export const EditingModal = ({
  buttonText,
  buttonTooltip,
  children,
  onSave,
  dataCy,
}: {
  buttonText: string
  buttonTooltip?: string
  children: ReactNode | ReactNode[]
  onSave?: () => Promise<boolean>
  dataCy?: string
}) => {
  const [open, setOpen] = useState(false)
  const closeWithSave = async () => {
    if (!onSave) return
    const close = await onSave()
    if (!close) return
    setOpen(false)
  }

  const OpenModalButton = () => {
    if (buttonTooltip)
      return (
        <Tooltip title={buttonTooltip}>
          <Button data-cy={dataCy} onClick={() => setOpen(true)} variant="contained" sx={{ marginBottom: '1em' }}>
            {buttonText}
          </Button>
        </Tooltip>
      )
    return (
      <Button data-cy={dataCy} onClick={() => setOpen(true)} variant="contained" sx={{ marginBottom: '1em' }}>
        {buttonText}
      </Button>

      <Modal
        open={open}
        aria-labelledby={`modal-${buttonText}`}
        aria-describedby={`modal-${buttonText}`}
        className="modal big"
      >
        <Box sx={{ ...modalStyle }} className="modal-content">
          <Box marginBottom="2em" marginTop="1em">
            {' '}
            {children}
          </Box>
          {onSave && (
            <Button sx={{ marginRight: '0.5em' }} variant="contained" onClick={() => void closeWithSave()}>
              Save
            </Button>
          )}
          <Button variant="contained" onClick={() => setOpen(false)}>
            {onSave ? 'Cancel' : 'Close'}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}
