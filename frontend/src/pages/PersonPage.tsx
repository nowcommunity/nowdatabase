import { fullRights, noRights } from '@/components/pages'
import { UserState } from '@/redux/userReducer'
import { PersonDetailsType, Role } from '@/shared/types'

import { Page } from '../components/Page'
import { PersonDetailPage } from './PersonDetailPage'
import { PersonListPage } from './PersonListPage'

export const PersonPage = () => {
  return (
    // Only admins are allowed to see this page, but the rights cannot be checked here through
    // allowedRoles, as the component has to be rendered for the user's own user-page.
    // This is ok because the requests should fail on backend anyways.
    <Page
      tableView={<PersonListPage />}
      detailView={<PersonDetailPage />}
      viewName="person"
      idFieldName="initials"
      createTitle={(person: PersonDetailsType) => `${person.surname}`}
      getEditRights={(user: UserState, id: number | string) => {
        if (user.role === Role.Admin) return fullRights
        if (user.initials === id || id === 'user-page') return { edit: true }
        return noRights
      }}
    />
  )
}
