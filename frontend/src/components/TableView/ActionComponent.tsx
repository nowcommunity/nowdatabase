import { Box, Button, Tooltip, Typography } from '@mui/material'
import { MRT_RowData, MRT_Row } from 'material-react-table'
import { useNavigate } from 'react-router-dom'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import PolicyIcon from '@mui/icons-material/Policy'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

export const ActionComponent = <T extends MRT_RowData>({
  row,
  idFieldName,
  checkRowRestriction,
  url,
  selectorFn,
  tableRowAction,
}: {
  row: MRT_Row<T>
  idFieldName: keyof T
  checkRowRestriction?: ((row: T) => boolean) | undefined
  url: string | undefined
  selectorFn?: (id: T) => void
  tableRowAction?: (row: T) => void
}) => {
  const navigate = useNavigate()
  const id = row.original[idFieldName]

  let buttonType: string
  if (tableRowAction) {
    buttonType = 'synonyms'
  } else if (selectorFn) {
    buttonType = 'add'
  } else {
    buttonType = 'details'
  }

  const getIconToShow = () => {
    if (tableRowAction) {
      return (
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',

            height: '100%',
            width: '100%',
          }}
          variant="button"
          component="p"
        >
          S
        </Typography>
      )
    } else if (selectorFn) {
      return <AddCircleOutlineIcon />
    }
    return <ManageSearchIcon />
  }

  const onClick = (event: React.MouseEvent) => {
    if (tableRowAction) {
      event.stopPropagation()
      tableRowAction(row.original)
    } else if (selectorFn) {
      event.stopPropagation()
      selectorFn(row.original)
    } else {
      navigate(`/${url}/${id}`)
    }
  }

  return (
    <Box display="flex" gap="0.2em" alignItems="center">
      <Button data-cy={`${buttonType}-button-${id}`} variant="text" style={{ width: '2em' }} onClick={onClick}>
        {getIconToShow()}
      </Button>
      {checkRowRestriction && checkRowRestriction(row.original) && (
        <Tooltip placement="top" title="This item has restricted visibility">
          <PolicyIcon color="primary" fontSize="medium" />
        </Tooltip>
      )}
    </Box>
  )
}
