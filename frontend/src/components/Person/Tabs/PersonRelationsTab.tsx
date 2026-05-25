import { Link as RouterLink } from 'react-router-dom'
import { Box, Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { PersonCoordinatorRelation, PersonDetailsType, PersonProjectRelation } from '@/shared/types'

const EmptyMessage = () => (
  <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
    No relations.
  </Typography>
)

const ProjectRelationsTable = ({ relations }: { relations: PersonProjectRelation[] }) => {
  if (relations.length === 0) return <EmptyMessage />

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Relation</TableCell>
          <TableCell>Project</TableCell>
          <TableCell>Code</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {relations.map((relation, index) => (
          <TableRow key={`${relation.relation}-${relation.pid}-${index}`}>
            <TableCell>{relation.relation}</TableCell>
            <TableCell>
              <Link component={RouterLink} to={`/project/${relation.pid}`}>
                {relation.proj_name || relation.pid}
              </Link>
            </TableCell>
            <TableCell>{relation.proj_code ?? ''}</TableCell>
            <TableCell>{relation.proj_status ?? ''}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const CoordinatorRelationsTable = ({ relations }: { relations: PersonCoordinatorRelation[] }) => {
  if (relations.length === 0) return <EmptyMessage />

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Details</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {relations.map(relation => (
          <TableRow key={`${relation.type}-${relation.id}`}>
            <TableCell>{relation.type}</TableCell>
            <TableCell>{relation.name}</TableCell>
            <TableCell>{relation.details ?? ''}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const PersonRelationsTab = () => {
  const { data } = useDetailContext<PersonDetailsType>()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '1em' }}>
      <Grouped title="Project Relations">
        <ProjectRelationsTable relations={data.project_relations ?? []} />
      </Grouped>
      <Grouped title="Coordinator Relations">
        <CoordinatorRelationsTable relations={data.coordinator_relations ?? []} />
      </Grouped>
    </Box>
  )
}
