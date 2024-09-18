import {
  TimeUnitDetailsType,
  ReferenceDetailsType,
  SpeciesDetailsType,
  LocalityDetailsType,
  TimeBoundDetailsType,
  PersonDetailsType,
  ProjectDetailsType,
  RegionDetails as RegionDetailsType,
} from '@/backendTypes'
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
import { PersonTable } from './Person/PersonTable'
import { PersonDetails } from './Person/PersonDetails'
import { ProjectTable } from './Project/ProjectTable'
import { ProjectDetails } from './Project/ProjectDetails'
import { RegionTable } from './Region/RegionTable'
import { RegionDetails } from './Region/RegionDetails'
import { Role } from '@/types'
import { UserState } from '@/redux/userReducer'

const noRights: EditRights = {}
const fullRights: EditRights = { new: true, edit: true, delete: true }
const limitedRights: EditRights = { new: true, edit: true }

export const localityPage = (
  <Page
    tableView={<LocalityTable />}
    detailView={<LocalityDetails />}
    viewName="locality"
    idFieldName="lid"
    createTitle={(loc: LocalityDetailsType) => `${loc.loc_name}`}
    getEditRights={(user: UserState, id: string | number) => {
      if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
      if (user.role === Role.EditRestricted && user.localities.includes(id as number)) return limitedRights
      return noRights
    }}
  />
)

export const crossSearchPage = (
  <Page
    tableView={<CrossSearchTable />}
    detailView={<LocalityDetails />}
    viewName="crosssearch"
    idFieldName="lid"
    createTitle={(loc: LocalityDetailsType) => `${loc.loc_name}`}
    getEditRights={(user: UserState, id: string | number) => {
      if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
      if (user.role === Role.EditRestricted && user.localities.includes(id as number)) return limitedRights
      return noRights
    }}
  />
)

export const speciesPage = (
  <Page
    tableView={<SpeciesTable />}
    detailView={<SpeciesDetails />}
    viewName="species"
    idFieldName="species_id"
    createTitle={(species: SpeciesDetailsType) => `${species.genus_name + ' ' + species.species_name}`}
    getEditRights={(user: UserState) => {
      if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
      if (user.role === Role.EditRestricted) return limitedRights
      return noRights
    }}
  />
)

export const referencePage = (
  <Page
    tableView={<ReferenceTable />}
    detailView={<ReferenceDetails />}
    viewName="reference"
    idFieldName="rid"
    createTitle={(ref: ReferenceDetailsType) => `${ref.title_primary}`}
    getEditRights={(user: UserState) => {
      if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
      if (user.role === Role.EditRestricted) return { new: true }
      return noRights
    }}
  />
)

export const timeUnitPage = (
  <Page
    tableView={<TimeUnitTable />}
    detailView={<TimeUnitDetails />}
    viewName="time-unit"
    idFieldName="tu_name"
    createTitle={(tu: TimeUnitDetailsType) => `${tu.tu_display_name}`}
    getEditRights={(user: UserState) => {
      if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
      return noRights
    }}
  />
)

export const timeBoundPage = (
  <Page
    allowedRoles={[Role.Admin, Role.EditUnrestricted]}
    tableView={<TimeBoundTable />}
    detailView={<TimeBoundDetails />}
    viewName="time-bound"
    idFieldName="bid"
    createTitle={(tb: TimeBoundDetailsType) => `${tb.b_name}`}
    getEditRights={(user: UserState) => {
      if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
      return noRights
    }}
  />
)

export const personPage = (
  // Only admins are allowed to see this page, but the rights cannot be checked here through
  // allowedRoles, as the component has to be rendered for the user's own user-page.
  // This is ok because the requests should fail on backend anyways.
  <Page
    tableView={<PersonTable />}
    detailView={<PersonDetails />}
    viewName="person"
    idFieldName="initials"
    createTitle={(person: PersonDetailsType) => `${person.surname}`}
    getEditRights={(user: UserState, id: number | string) => {
      if (user.role === Role.Admin) return fullRights
      if (user.initials === id) return { edit: true }
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
