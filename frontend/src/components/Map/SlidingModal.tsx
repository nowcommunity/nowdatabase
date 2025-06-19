import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import '../../styles/SlidingModal.css'

interface Props {
  children: JSX.Element
  isOpen: boolean
  onClose: () => void
}

export const SlidingModal = ({ children, isOpen, onClose }: Props) => {
  return (
    <div className={`sliding-modal-container ${isOpen ? 'open' : ''}`}>
      <div className="background" onClick={onClose}></div>
      <div
        className="content"
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <Button sx={{ marginTop: '2.5em', marginLeft: '1em' }} onClick={onClose}>
          <ArrowBackIcon color="primary" style={{ marginRight: '0.2em' }} />
          Return to map
        </Button>
        {children}
      </div>
    </div>
  )
}
