import { fullRights, noRights } from '@/components/pages'
import { TimeUnitDetails } from '@/components/TimeUnit/TimeUnitDetails'
import { TimeUnitTable } from '@/components/TimeUnit/TimeUnitTable'
import { UserState } from '@/redux/userReducer'
import { Role, TimeUnitDetailsType } from '@/shared/types'

import { Page } from '../components/Page'
import { UnsavedChangesProvider } from '../components/UnsavedChangesProvider'

export const TimeUnitPage = () => {
  return (
    <UnsavedChangesProvider>
      <Page
        tableView={<TimeUnitTable />}
        detailView={<TimeUnitDetails wrapWithUnsavedChangesProvider={false} />}
        viewName="time-unit"
        idFieldName="tu_name"
        createTitle={(tu: TimeUnitDetailsType) => `${tu.tu_display_name}${tu.tu_comment ? ` - ${tu.tu_comment}` : ''}`}
        createSubtitle={(tu: TimeUnitDetailsType) =>
          `${tu.up_bound?.age} Ma \u2013 ${tu.low_bound?.age} Ma` +
          `\n${tu.now_tu_sequence.seq_name}` +
          ` (${tu.rank ? tu.rank : 'No rank'})`
        }
        getEditRights={(user: UserState) => {
          if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
          return noRights
        }}
      />
    </UnsavedChangesProvider>
  )
}
