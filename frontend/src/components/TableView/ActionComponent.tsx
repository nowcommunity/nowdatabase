import { useMemo, type MouseEvent } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
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
  getDetailPath,
}: {
  row: MRT_Row<T>
  idFieldName: keyof T
  checkRowRestriction?: ((row: T) => boolean) | undefined
  url: string | undefined
  selectorFn?: (id: T) => void
  tableRowAction?: (row: T) => void
  getDetailPath?: (row: T) => string
}) => {
  const navigate = useNavigate()
  const { previousTableUrls, setPreviousTableUrls } = usePageContext()
  const [searchParams] = useSearchParams()
  const id = row.original[idFieldName]

  const actionConfig = useMemo(() => {
    if (tableRowAction) {
      return {
        buttonType: 'synonyms',
        tooltip: 'Open synonym dialog',
        ariaLabel: 'Open synonym dialog',
        icon: (
          <Typography
            component="span"
            variant="button"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 600,
              fontSize: '0.85rem',
              lineHeight: 1,
            }}
          >
            S
          </Typography>
        ),
      }
    }

    if (selectorFn) {
      return {
        buttonType: 'add',
        tooltip: 'Select this row',
        ariaLabel: 'Select this row',
        icon: <AddCircleOutlineIcon fontSize="small" />,
      }
    }

    return {
      buttonType: 'details',
      tooltip: 'View details',
      ariaLabel: 'View details',
      icon: <ManageSearchIcon fontSize="small" />,
    }
  }, [selectorFn, tableRowAction])

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (tableRowAction) {
      event.stopPropagation()
      tableRowAction(row.original)
      return
    }

    if (selectorFn) {
      event.stopPropagation()
      selectorFn(row.original)
      return
    }

    setPreviousTableUrls([...previousTableUrls, `${location.pathname}?tab=${searchParams.get('tab')}`])
    const detailPath = getDetailPath ? getDetailPath(row.original) : `/${url}/${id}`
    navigate(detailPath, { state: { returnTo: `${location.pathname}${location.search}` } })
  }

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Tooltip placement="top" title={actionConfig.tooltip}>
        <IconButton
          aria-label={actionConfig.ariaLabel}
          data-cy={`${actionConfig.buttonType}-button-${id}`}
          onClick={onClick}
          size="small"
          sx={{ p: 0.5 }}
        >
          {actionConfig.icon}
        </IconButton>
      </Tooltip>
      {checkRowRestriction && checkRowRestriction(row.original) && (
        <Tooltip placement="top" title="This item has restricted visibility">
          <PolicyIcon aria-label="Restricted visibility indicator" color="primary" fontSize="medium" />
        </Tooltip>
      )}
    </Box>
  )
}
