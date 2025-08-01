import { Box, Button, Tooltip, Typography } from '@mui/material'
import { MRT_RowData, MRT_Row } from 'material-react-table'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import PolicyIcon from '@mui/icons-material/Policy'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { usePageContext } from '../Page'

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
  const { previousTableUrls, setPreviousTableUrls } = usePageContext()
  const [searchParams] = useSearchParams()

  const id = row.original[idFieldName]

  const getIconToShow = () => {
    if (selectorFn) {
      return <AddCircleOutlineIcon />
    } else if (tableRowAction) {
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
    }
    return <ManageSearchIcon />
  }

  const onClick = (event: React.MouseEvent) => {
    if (selectorFn) {
      event.stopPropagation()
      selectorFn(row.original)
    } else if (tableRowAction) {
      event.stopPropagation()
      tableRowAction(row.original)
    } else {
      setPreviousTableUrls([...previousTableUrls, `${location.pathname}?tab=${searchParams.get('tab')}`])
      navigate(`/${url}/${id}`)
    }
  }

  return (
    <Box display="flex" gap="0.2em" alignItems="center">
      <Button data-cy={`detailview-button-${id}`} variant="text" style={{ width: '2em' }} onClick={onClick}>
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
