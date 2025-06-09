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
        {children}
      </div>
    </div>
  )
}
