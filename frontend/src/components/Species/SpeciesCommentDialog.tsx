import { Box, IconButton, Modal, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import '../../styles/species/SynonymsModal.css'

type SpeciesCommentDialogProps = {
  open: boolean
  onClose: () => void
  genusName: string | null
  speciesName: string | null
  comment: string | null
}

const buildHeading = (genusName: string | null, speciesName: string | null) => {
  const parts = [genusName, speciesName].filter(Boolean)
  if (parts.length === 0) {
    return 'Species Comment'
  }

  return `Species Comment - ${parts.join(' ')}`
}

export const SpeciesCommentDialog = ({ open, onClose, genusName, speciesName, comment }: SpeciesCommentDialogProps) => {
  const commentContent = comment?.trim() ?? ''
  const displayText = commentContent.length > 0 ? commentContent : 'No comment available.'

  const dialogTitle = buildHeading(genusName, speciesName)

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="synonyms-modal modal"
      aria-labelledby="species-comment-dialog-title"
    >
      <Box className="modal-content" role="document">
        <Box className="modal-header">
          <Typography id="species-comment-dialog-title" variant="h6" component="h2">
            {dialogTitle}
          </Typography>
          <IconButton sx={{ color: 'white' }} onClick={onClose} aria-label="close" className="close-button">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ padding: 2 }}>
          <Typography variant="body1" component="p" sx={{ whiteSpace: 'pre-wrap' }}>
            {displayText}
          </Typography>
        </Box>
      </Box>
    </Modal>
  )
}
