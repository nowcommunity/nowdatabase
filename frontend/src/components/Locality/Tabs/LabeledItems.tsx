import { Box, Grid } from '@mui/material'
import { useDetailContext } from './Context/hook'
import { ReactNode } from 'react'

export type LabeledItem = {
  label: string
  display: ReactNode
  editable?: ReactNode
}

export const LabeledItems = ({ items }: { items: LabeledItem[] }) => {
  const mode = useDetailContext()
  return (
    <Box>
      <Grid direction="column" container rowGap={'0.4em'}>
        {items.map(item => (
          <Grid key={item.label} direction="row" container gap="2em">
            <Grid xs={4} item>
              <b>{item.label}</b>
            </Grid>
            <Grid xs={4} item>
              {mode.mode !== 'read' && item.editable ? item.editable : item.display}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
