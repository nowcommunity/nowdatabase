import { Box, Grid } from '@mui/material'
import { ReactNode } from 'react'

export type LabeledItem = {
  label: string
  component?: ReactNode
}

export const LabeledItems = ({ items }: { items: LabeledItem[] }) => {
  return (
    <Box>
      <Grid direction="column" container rowGap={'0.4em'}>
        {items.map(item => (
          <Grid key={item.label} direction="row" container gap="2em">
            <Grid xs={4} item>
              <b>{item.label}</b>
            </Grid>
            <Grid xs={4} item>
              {item.component}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
