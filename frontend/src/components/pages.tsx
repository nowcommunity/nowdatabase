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
    createTitle={(loc: LocalityDetailsType) =>
      `${loc.lid} ${loc.loc_name}, ${loc.country} \n${loc.dms_lat}, ${loc.dms_long}\n${loc.max_age} Ma (${loc.bfa_max}) – ${loc.min_age} Ma (${loc.bfa_min})`
    }
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
    createTitle={(species: SpeciesDetailsType) =>
      `${species.species_id} ${species.genus_name + ' ' + species.species_name}` +
      `\n${species.unique_identifier}` +
      `\nOrder ${species.order_name}` +
      `\nFamily ${species.family_name}` +
      `\nSubfamily or Tribe ${species.subfamily_name}`
    }
    getEditRights={(user: UserState) => {
      if ([Role.Admin, Role.EditUnrestricted].includes(user.role)) return fullRights
      if (user.role === Role.EditRestricted) return limitedRights
      return noRights
    }}
  />
)

// Instead of "Cenozoic Geochronology", use
// 30
// Berggren et al. (1985). Cenozoic Geochronology. Geological Society of America Bulletin 96: 1407-1418.

// uh miten saan noi et al. >:/ <-- updateTab / makenamelist

// http://localhost:5173/reference/10031 ?? miksei tee mitään?? AHAA null, no vittu
// 10031 nyt about toimii

//tää on nyt TÄYSIN varastettu UpdateTabista, paitsi lisätty undefined

const makeNameList = (names: Array<string | null | undefined>) => {
  if (names.length === 3) {
    return `${names[0]}, ${names[1]} & ${names[2]}`
  } else if (names.length >= 4) {
    return `${names[0]} et al.`
  } else if (names.length === 2) {
    return `${names[0]} & ${names[1]}`
  }
  return names[0] ?? ''
}

export const referencePage = (
  <Page
    tableView={<ReferenceTable />}
    detailView={<ReferenceDetails />}
    viewName="reference"
    idFieldName="rid"
    createTitle={(ref: ReferenceDetailsType) =>
      `${ref.rid}` +
      `\n${makeNameList(ref.ref_authors.map(author => author.author_surname))} (${ref.date_primary ? ref.date_primary : 'date missing'}).` +
      `\n${ref.title_primary ? ref.title_primary + '.' : ''}` +
      `\n${ref.ref_journal && ref.ref_type_id == 1 ? ref.ref_journal.journal_title + '. ' : ''}${ref.title_secondary ? ref.title_secondary + '. ' : ''}${ref.gen_notes ? ref.gen_notes : ''}` +
      `\n${ref.volume ? ref.volume + ' ' : ''} ${ref.start_page || ref.end_page ? 'pp: ' : ''}${ref.start_page ? ref.start_page + '-' : ''}${ref.end_page ? ref.end_page : ''} ${ref.publisher ? ref.publisher : ''}${ref.pub_place ? ', ' + ref.pub_place : ''}`
    }
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
