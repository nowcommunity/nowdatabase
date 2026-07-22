import { fullRights, limitedRights, noRights } from '@/components/pages'
import { UserState } from '@/redux/userReducer'
import { Role, SpeciesDetailsType } from '@/shared/types'

import { Page } from '../components/Page'
import { SpeciesDetails } from '../components/Species/SpeciesDetails'
import { SpeciesTable } from '../components/Species/SpeciesTable'
import { UnsavedChangesProvider } from '../components/UnsavedChangesProvider'

export const SpeciesPage = () => {
  return (
    <UnsavedChangesProvider>
      <Page
        tableView={<SpeciesTable />}
        detailView={<SpeciesDetails wrapWithUnsavedChangesProvider={false} />}
        viewName="species"
        idFieldName="species_id"
        createTitle={(species: SpeciesDetailsType) =>
          `${species.species_id} ${species.genus_name} ${species.species_name}` + `\n${species.unique_identifier}`
        }
        createSubtitle={(species: SpeciesDetailsType) =>
          `Order ${species.order_name}` +
          `\nFamily ${species.family_name}` +
          `\nSubfamily or Tribe ${species.subfamily_name}`
        }
        getEditRights={(user: UserState) => {
          if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
          if (user.role === Role.EditRestricted) return limitedRights
          return noRights
        }}
      />
    </UnsavedChangesProvider>
  )
}
