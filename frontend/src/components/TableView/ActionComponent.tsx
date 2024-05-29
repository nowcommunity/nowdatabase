import { Box, Button, Tooltip } from '@mui/material'
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
}: {
  row: MRT_Row<T>
  idFieldName?: keyof T
  checkRowRestriction: ((row: T) => boolean) | undefined
  url: string | undefined
  selectorFn?: (id: T) => void
}) => {
  const navigate = useNavigate()
  const id = row.original[idFieldName!]
  const getIconToShow = () => {
    if (selectorFn) return <AddCircleOutlineIcon />
    return <ManageSearchIcon />
  }
  const onClick = () => {
    if (selectorFn) {
      selectorFn(row.original)
    } else {
      navigate(`/${url}/${id}`)
    }
  }
  return (
    <Box display="flex" gap="0.2em" alignItems="center" width="3.6em">
      <Button variant="text" style={{ width: '2em' }} onClick={onClick}>
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
