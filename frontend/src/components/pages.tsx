import {
  TimeUnitDetailsType,
  SpeciesDetailsType,
  LocalityDetailsType,
  TimeBoundDetailsType,
  PersonDetailsType,
  OccurrenceDetailsType,
  ProjectDetailsType,
  RegionDetails as RegionDetailsType,
  Role,
  Museum,
} from '@/shared/types'
import { CrossSearchTable } from './CrossSearch/CrossSearchTable'
import { LocalityDetails } from './Locality/LocalityDetails'
import { LocalityTable } from './Locality/LocalityTable'
import { EditRights, Page } from './Page'
import { ReferenceTable } from './Reference/ReferenceTable'
import { SpeciesDetails } from './Species/SpeciesDetails'
import { SpeciesTable } from './Species/SpeciesTable'
import { TimeBoundDetails } from './TimeBound/TimeBoundDetails'
import { TimeBoundTable } from './TimeBound/TimeBoundTable'
import { TimeUnitTable } from './TimeUnit/TimeUnitTable'
import { TimeUnitDetails } from './TimeUnit/TimeUnitDetails'
import { ReferenceDetails } from './Reference/ReferenceDetails'
import { PersonListPage } from '@/pages/PersonListPage'
import { PersonDetailPage } from '@/pages/PersonDetailPage'
import { ProjectTable } from './Project/ProjectTable'
import { ProjectDetails } from './Project/ProjectDetails'
import { RegionTable } from './Region/RegionTable'
import { RegionDetails } from './Region/RegionDetails'
import { UserState } from '@/redux/userReducer'
import { FrontPage } from './FrontPage'
import { MuseumTable } from './Museum/MuseumTable'
import { MuseumDetails } from './Museum/MuseumDetails'
import { createReferenceSubtitle, createReferenceTitle } from './Reference/referenceFormatting'
import { UnsavedChangesProvider } from './UnsavedChangesProvider'
import { OccurrenceDetails } from './Occurrence/OccurrenceDetails'

const noRights: EditRights = {}
const fullRights: EditRights = { new: true, edit: true, delete: true }
const limitedRights: EditRights = { new: true, edit: true }

export const localityPage = (
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
        if (user.role === Role.EditRestricted && user.localities.includes(id as number)) return limitedRights
        return noRights
      }}
    />
  </UnsavedChangesProvider>
)

export const frontPage = <FrontPage />

export const crossSearchPage = (
  <Page
    tableView={<CrossSearchTable />}
    detailView={<OccurrenceDetails />}
    viewName="occurrence"
    idFieldName="lid"
    createTitle={(occurrence: OccurrenceDetailsType) =>
      `${occurrence.lid} ${occurrence.loc_name}, ${occurrence.country}\n${occurrence.genus_name} ${occurrence.species_name}`
    }
    createSubtitle={(occurrence: OccurrenceDetailsType) =>
      `${occurrence.max_age ?? '?'} Ma (${occurrence.bfa_max ?? '?'}) – ${occurrence.min_age ?? '?'} Ma (${occurrence.bfa_min ?? '?'})`
    }
    getEditRights={(user: UserState, id: string | number) => {
      if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
      if (user.role === Role.EditRestricted && user.localities.includes(id as number)) return limitedRights
      return noRights
    }}
  />
)

export const speciesPage = (
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

export const museumPage = (
  <UnsavedChangesProvider>
    <Page
      tableView={<MuseumTable />}
      detailView={<MuseumDetails wrapWithUnsavedChangesProvider={false} />}
      viewName="museum"
      idFieldName="museum"
      createTitle={(museum: Museum) => `${museum.institution}`}
      createSubtitle={(museum: Museum) => `${museum.city ? `${museum.city}, ` : ''}${museum.country}`}
      getEditRights={(user: UserState, id: string | number) => {
        if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
        if (user.role === Role.EditRestricted && user.localities.includes(id as number)) return limitedRights
        return noRights
      }}
    />
  </UnsavedChangesProvider>
)

export const referencePage = (
  <UnsavedChangesProvider>
    <Page
      tableView={<ReferenceTable />}
      detailView={<ReferenceDetails wrapWithUnsavedChangesProvider={false} />}
      viewName="reference"
      idFieldName="rid"
      createTitle={createReferenceTitle}
      createSubtitle={createReferenceSubtitle}
      getEditRights={(user: UserState) => {
        if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
        if (user.role === Role.EditRestricted) return { new: true }
        return noRights
      }}
    />
  </UnsavedChangesProvider>
)

export const timeUnitPage = (
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

export const timeBoundPage = (
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

export const personPage = (
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

export const projectPage = (
  <Page
    allowedRoles={[Role.Admin]}
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

export const regionPage = (
  <Page<RegionDetailsType>
    allowedRoles={[Role.Admin]}
    tableView={<RegionTable />}
    detailView={<RegionDetails />}
    viewName="region"
    idFieldName="reg_coord_id"
    createTitle={(region: RegionDetailsType) => `${region.region}`}
    getEditRights={(user: UserState) => {
      if (user.role === Role.Admin) return fullRights
      return noRights
    }}
  />
)
