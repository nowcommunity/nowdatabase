import { useParams } from 'react-router-dom'
import { useGetLocalityDetailsQuery } from '../../redux/localityReducer'
import { Box, Card, CircularProgress, Typography } from '@mui/material'
import { DetailView, TabType } from '../DetailView'
import { ReactNode } from 'react'
import { AgeTab } from './Tabs/AgeTab'
import { LocalityTab } from './Tabs/LocalityTab'

export const Grouped = ({ title, children }: { title?: string; children: ReactNode }) => {
  return (
    <Card style={{ margin: '1em', padding: '10px' }} variant="outlined">
      {title && (
        <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
      )}
      <Box marginTop="15px">{children}</Box>
    </Card>
  )
}

export const LocalityDetails = () => {
  const { id } = useParams()
  const { isLoading, isError, data } = useGetLocalityDetailsQuery(id)

  if (isError) return <div>Error loading data</div>
  if (isLoading || !data) return <CircularProgress />

  const tabs: TabType[] = [
    {
      title: 'Age',
      content: <AgeTab />,
    },
    {
      title: 'Locality',
      content: <LocalityTab />,
    },
  ]

  return <DetailView tabs={tabs} data={data} />
}
