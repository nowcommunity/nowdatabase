import { Box, Modal, Alert, Typography, IconButton, Table, TableBody, TableRow, TableCell } from '@mui/material'
import { useGetSpeciesDetailsQuery } from '../../redux/speciesReducer'
import { skipToken } from '@reduxjs/toolkit/query/react'
import CloseIcon from '@mui/icons-material/Close'
import '../../styles/species/SynonymsModal.css'

export const SynonymsModal = ({
  open,
  onClose,
  selectedSpecies,
}: {
  open: boolean
  onClose: () => void
  selectedSpecies: string | undefined
}) => {
  const { isError, isFetching, data } = useGetSpeciesDetailsQuery(selectedSpecies ? selectedSpecies : skipToken)

  if (isFetching) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box className="modal-content"></Box>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={onClose} className="synonyms-modal modal">
      <Box className="modal-content">
        <Box className="modal-header">
          <Typography variant="h6" component="h2">
            {`Synonyms ${isError ? '' : `- ${data?.genus_name} ${data?.species_name}`}`}
          </Typography>

          <IconButton sx={{ color: 'white' }} onClick={onClose} aria-label="close" className="close-button">
            <CloseIcon />
          </IconButton>
        </Box>
        {isError ? (
          <Alert severity="error" sx={{ m: 2 }}>
            Failed to load species details. Please try again later.
          </Alert>
        ) : (
          <Table className="modal-table">
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Genus</strong>
                </TableCell>
                <TableCell>
                  <strong>Species</strong>
                </TableCell>
                <TableCell>
                  <strong>Comments</strong>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{data?.genus_name}</TableCell>
                <TableCell>{data?.species_name}</TableCell>
                <TableCell>{data?.sp_comment}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Box>
    </Modal>
  )
}
