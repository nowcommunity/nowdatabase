import { LocalityDetails } from '@/components/Locality/LocalityDetails'
import { LocalityTable } from '@/components/Locality/LocalityTable'
import { fullRights, limitedRights, noRights, userHasLocalityAccess } from '@/components/pages'
import { UserState } from '@/redux/userReducer'
import { LocalityDetailsType, Role } from '@/shared/types'

import { Page } from '../components/Page'
import { UnsavedChangesProvider } from '../components/UnsavedChangesProvider'

export const LocalityPage = () => {
  return (
    <UnsavedChangesProvider>
      <Page
        tableView={<LocalityTable />}
        detailView={<LocalityDetails wrapWithUnsavedChangesProvider={false} />}
        viewName="locality"
        idFieldName="lid"
        createTitle={(loc: LocalityDetailsType) => `${loc.lid} ${loc.loc_name}, ${loc.country}`}
        createSubtitle={(loc: LocalityDetailsType) =>
          `${loc.dms_lat}, ${loc.dms_long}\n${loc.max_age} Ma (${loc.bfa_max}) – ${loc.min_age} Ma (${loc.bfa_min})`
        }
        getEditRights={(user: UserState, id: string | number) => {
          if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
          if (user.role === Role.EditRestricted) {
            if (id === '' || id === 'new') return { new: true }
            if (userHasLocalityAccess(user, id)) return limitedRights
          }
          return noRights
        }}
      />
    </UnsavedChangesProvider>
  )
}
