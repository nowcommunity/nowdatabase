import { PermissionDenied } from '@/components/PermissionDenied'
import { useUser } from '@/hooks/user'
import { fullRights, noRights } from '@/components/pages'
import { ProjectDetails } from '@/components/Project/ProjectDetails'
import { ProjectTable } from '@/components/Project/ProjectTable'
import { UserState } from '@/redux/userReducer'
import { ProjectDetailsType, Role } from '@/shared/types'

import { Page } from '../components/Page'

export const ProjectPage = () => {
  const user = useUser()
  if (!user.username) return <PermissionDenied message="Please log in to view Projects." />

  return (
    <Page
      tableView={<ProjectTable />}
      detailView={<ProjectDetails />}
      viewName="project"
      idFieldName="pid"
      createTitle={(project: ProjectDetailsType) => `${project.proj_name}`}
      getEditRights={(user: UserState) => {
        if (user.role === Role.Admin) return fullRights
        return noRights
      }}
    />
  )
}
