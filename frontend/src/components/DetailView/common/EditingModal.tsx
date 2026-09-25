import { Box, Button, Modal } from '@mui/material'
import { ReactNode, useState } from 'react'
import { modalStyle } from './misc'
import '../../../styles/modal.css'

type EditingModalRenderProps = {
  close: () => void
}

type EditingModalChildren = ReactNode | ((props: EditingModalRenderProps) => ReactNode)

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
  showCloseButton = true,
  dataCy,
}: {
  buttonText: string
  children: EditingModalChildren
  onSave?: () => Promise<boolean>
  showCloseButton?: boolean
  dataCy?: string
}) => {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const closeWithSave = async () => {
    if (!onSave) return
    const close = await onSave()
    if (!close) return
    setOpen(false)
  }

  // If the child of this modal is a function, then the function receives the close function as a prop.
  // This can be used by the child to close the modal.
  const content = typeof children === 'function' ? children({ close }) : children

  return (
    <Box>
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
            {content}
          </Box>
          {onSave && (
            <Button
              id={'editing-modal-save-button'}
              sx={{ marginRight: '0.5em' }}
              variant="contained"
              onClick={() => void closeWithSave()}
            >
              Save
            </Button>
          )}
          {showCloseButton && (
            <Button id="editing-modal-cancel-button" variant="contained" onClick={close}>
              {onSave ? 'Cancel' : 'Close'}
            </Button>
          )}
        </Box>
      </Modal>
    </Box>
  )
}
