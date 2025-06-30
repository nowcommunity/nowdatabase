import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import '../../styles/SlidingModal.css'

interface Props {
  children: JSX.Element
  isOpen: boolean
  onClose: () => void
  returnButtonText?: string
  id?: string
}

export const SlidingModal = ({ children, isOpen, onClose, returnButtonText = 'Return', id }: Props) => {
  return (
    <div className={`sliding-modal-container ${isOpen ? 'open' : ''}`} id={id}>
      <div className="background" onClick={onClose}></div>
      <div
        className="content"
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <Button sx={{ marginTop: '2.5em', marginLeft: '1em' }} onClick={onClose}>
          <ArrowBackIcon color="primary" style={{ marginRight: '0.2em' }} />
          {returnButtonText}
        </Button>
        {children}
      </div>
    </div>
  )
}
