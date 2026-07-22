import { MuseumDetails } from '@/components/Museum/MuseumDetails'
import { MuseumTable } from '@/components/Museum/MuseumTable'
import { fullRights, limitedRights, noRights } from '@/components/pages'
import { UserState } from '@/redux/userReducer'
import { Museum, Role } from '@/shared/types'

import { Page } from '../components/Page'
import { UnsavedChangesProvider } from '../components/UnsavedChangesProvider'

export const MuseumPage = () => {
  return (
    <UnsavedChangesProvider>
      <Page
        tableView={<MuseumTable />}
        detailView={<MuseumDetails wrapWithUnsavedChangesProvider={false} />}
        viewName="museum"
        idFieldName="museum"
        createTitle={(museum: Museum) => `${museum.institution}`}
        createSubtitle={(museum: Museum) => `${museum.city ? `${museum.city}, ` : ''}${museum.country}`}
        getEditRights={(user: UserState) => {
          if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
          if (user.role === Role.EditRestricted) return limitedRights
          return noRights
        }}
      />
    </UnsavedChangesProvider>
  )
}
