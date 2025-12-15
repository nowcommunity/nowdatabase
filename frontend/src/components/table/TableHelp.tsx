import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import { Box, IconButton, List, ListItem, ListItemText, Popover, Tooltip, Typography } from '@mui/material'

type TableHelpProps = {
  showFiltering?: boolean
  showSorting?: boolean
  showMultiSorting?: boolean
  showColumnVisibility?: boolean
  showExport?: boolean
  title?: string
  description?: string
}

const DEFAULT_TITLE = 'How to use this table'
const DEFAULT_DESCRIPTION = 'Use these tips to quickly interact with the table.'

export const TableHelp = ({
  showFiltering = false,
  showSorting = false,
  showMultiSorting = false,
  showColumnVisibility = false,
  showExport = false,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: TableHelpProps) => {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)

  const tips = useMemo(() => {
    const items: string[] = []

    if (showFiltering) {
      items.push('Filter rows using the column filter icons or quick search where available.')
    }

    if (showSorting) {
      items.push('Click a column header to sort ascending/descending by that column.')
    }

    if (showMultiSorting) {
      items.push('Hold Shift while clicking column headers to apply multi-column sorting.')
    }

    if (showColumnVisibility) {
      items.push('Use the column visibility menu to show or hide columns that matter to you.')
    }

    if (showExport) {
      items.push('Export the current table data using the export menu (e.g., CSV).')
    }

    return items
  }, [showFiltering, showSorting, showMultiSorting, showColumnVisibility, showExport])

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorElement(null)
  }

  const open = Boolean(anchorElement)
  const id = open ? 'table-help-popover' : undefined

  return (
    <>
      <Tooltip title="Table usage help">
        <IconButton aria-label="Open table help" aria-describedby={id} onClick={handleOpen} size="small">
          <Typography component="span" fontWeight={700} aria-hidden={true}>
            ?
          </Typography>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorElement}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box p={2} maxWidth={360} display="flex" flexDirection="column" gap={1}>
          <Typography variant="subtitle1" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <List dense sx={{ py: 0 }}>
            {tips.length === 0 ? (
              <ListItem>
                <ListItemText primary="No additional table actions are available." />
              </ListItem>
            ) : (
              tips.map(tip => (
                <ListItem key={tip} sx={{ alignItems: 'flex-start' }}>
                  <ListItemText primary={tip} />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Popover>
    </>
  )
}

export type { TableHelpProps }
