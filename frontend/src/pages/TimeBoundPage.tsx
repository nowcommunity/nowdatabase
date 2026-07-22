import { fullRights, noRights } from '@/components/pages'
import { TimeBoundDetails } from '@/components/TimeBound/TimeBoundDetails'
import { TimeBoundTable } from '@/components/TimeBound/TimeBoundTable'
import { UserState } from '@/redux/userReducer'
import { Role, TimeBoundDetailsType } from '@/shared/types'

import { Page } from '../components/Page'
import { UnsavedChangesProvider } from '../components/UnsavedChangesProvider'

export const TimeBoundPage = () => {
  return (
    <UnsavedChangesProvider>
      <Page
        allowedRoles={[Role.Admin, Role.EditUnrestricted]}
        tableView={<TimeBoundTable />}
        detailView={<TimeBoundDetails wrapWithUnsavedChangesProvider={false} />}
        viewName="time-bound"
        idFieldName="bid"
        createTitle={(tb: TimeBoundDetailsType) => `${tb.bid} ${tb.b_name}`}
        getEditRights={(user: UserState) => {
          if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
          return noRights
        }}
      />
    </UnsavedChangesProvider>
  )
}
