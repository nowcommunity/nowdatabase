import { Button, Modal } from '@mui/material'
import { SingleLocalityMap } from '../Map/SingleLocalityMap'
import { CountryBoundingBox } from '@/country_data/countryBoundingBoxes'

export interface OutOfBoundsWarningModalState {
  decLong: number
  decLat: number
  boxes?: CountryBoundingBox[]
}

interface Props {
  onAnswer: (answer: boolean) => void
  state: OutOfBoundsWarningModalState
  isOpen: boolean
}

export const OutOfBoundsWarningModal = ({ isOpen, state, onAnswer }: Props) => {
  return (
    <Modal open={isOpen} className={`modal ${isOpen ? 'open' : ''}`} onClick={() => onAnswer(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Coordinate warning</h3>
        <p style={{ marginBottom: '2em' }}>
          The coordinate selected is outside of the locality country. Do you still want to proceed?
        </p>
        <SingleLocalityMap decLat={state.decLat} decLong={state.decLong} boxes={state.boxes} />
        <div style={{ marginTop: '1em' }}>
          <Button variant="contained" onClick={() => onAnswer(false)}>
            Cancel
          </Button>
          <Button sx={{ marginLeft: '0.6em' }} variant="contained" onClick={() => onAnswer(true)}>
            Proceed
          </Button>
        </div>
      </div>
    </Modal>
  )
}
