import { CrossSearchTable } from '@/components/CrossSearch/CrossSearchTable'
import { OccurrenceDetails } from '@/components/Occurrence/OccurrenceDetails'
import { fullRights, limitedRights, noRights, userHasLocalityAccess } from '@/components/pages'
import { UserState } from '@/redux/userReducer'
import { OccurrenceDetailsType, Role } from '@/shared/types'

import { Page } from '../components/Page'

export const OccurrencesPage = () => {
  return (
    <Page
      tableView={<CrossSearchTable />}
      detailView={<OccurrenceDetails />}
      viewName="occurrence"
      idFieldName="lid"
      createTitle={(occurrence: OccurrenceDetailsType) => {
        const genusSpecies = `${occurrence.genus_name} ${occurrence.species_name}`.trim()
        const hasUsefulUniqueIdentifier =
          !!occurrence.unique_identifier &&
          occurrence.unique_identifier.trim() !== '-' &&
          occurrence.unique_identifier.trim() !== ''
        const speciesDisplay = genusSpecies || (hasUsefulUniqueIdentifier ? occurrence.unique_identifier : '-')

        return `${occurrence.lid} ${occurrence.loc_name}, ${occurrence.country}
${speciesDisplay} (species_id: ${occurrence.species_id})`
      }}
      createSubtitle={(occurrence: OccurrenceDetailsType) =>
        `${occurrence.dms_lat ?? ''}, ${occurrence.dms_long ?? ''}
${occurrence.max_age ?? ''} Ma (${occurrence.bfa_max ?? ''}) – ${occurrence.min_age ?? ''} Ma (${occurrence.bfa_min ?? ''})`
      }
      getEditRights={(user: UserState, id: string | number) => {
        if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
        if (user.role === Role.EditRestricted && userHasLocalityAccess(user, id)) return limitedRights
        return noRights
      }}
    />
  )
}
