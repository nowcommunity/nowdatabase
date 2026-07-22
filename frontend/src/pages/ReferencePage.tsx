import { fullRights, limitedRights, noRights } from '@/components/pages'
import { ReferenceDetails } from '@/components/Reference/ReferenceDetails'
import { ReferenceTable } from '@/components/Reference/ReferenceTable'
import { UserState } from '@/redux/userReducer'
import { Role } from '@/shared/types'

import { Page } from '../components/Page'
import { createReferenceSubtitle, createReferenceTitle } from '../components/Reference/referenceFormatting'
import { UnsavedChangesProvider } from '../components/UnsavedChangesProvider'

export const ReferencePage = () => {
  return (
    <UnsavedChangesProvider>
      <Page
        tableView={<ReferenceTable />}
        detailView={<ReferenceDetails wrapWithUnsavedChangesProvider={false} />}
        viewName="reference"
        idFieldName="rid"
        createTitle={createReferenceTitle}
        createSubtitle={createReferenceSubtitle}
        getEditRights={(user: UserState) => {
          if (user.role === Role.Admin) return fullRights
          if (user.role === Role.EditUnrestricted) return limitedRights
          if (user.role === Role.EditRestricted) return limitedRights
          return noRights
        }}
      />
    </UnsavedChangesProvider>
  )
}
