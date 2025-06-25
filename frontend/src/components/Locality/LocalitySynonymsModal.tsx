import { Box, Modal, Alert, Typography, IconButton, Table, TableBody, TableRow, TableCell } from '@mui/material'
import { useGetLocalityDetailsQuery } from '../../redux/localityReducer'
import { skipToken } from '@reduxjs/toolkit/query/react'
import CloseIcon from '@mui/icons-material/Close'
import '../../styles/species/SynonymsModal.css'

export const LocalitySynonymsModal = ({
  open,
  onClose,
  selectedLocality,
}: {
  open: boolean
  onClose: () => void
  selectedLocality: string | undefined
}) => {
  const { isError, isFetching, data } = useGetLocalityDetailsQuery(selectedLocality ? selectedLocality : skipToken)

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
            {`Synonyms ${isError ? '' : `- ${data?.loc_name}`}`}
          </Typography>

          <IconButton sx={{ color: 'white' }} onClick={onClose} aria-label="close" className="close-button">
            <CloseIcon />
          </IconButton>
        </Box>
        {isError ? (
          <Alert severity="error" sx={{ m: 2 }}>
            Failed to load locality details. Please try again later.
          </Alert>
        ) : (
          <Table className="modal-table">
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Locality synonyms</strong>
                </TableCell>
              </TableRow>
              {data?.now_syn_loc?.map((synonym, index) => (
                <TableRow key={index}>
                  <TableCell>{synonym.synonym}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Modal>
  )
}
