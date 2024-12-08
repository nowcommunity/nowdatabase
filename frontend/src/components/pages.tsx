import {
  TimeUnitDetailsType,
  ReferenceDetailsType,
  SpeciesDetailsType,
  LocalityDetailsType,
  TimeBoundDetailsType,
  PersonDetailsType,
  ProjectDetailsType,
  RegionDetails as RegionDetailsType,
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
)

export const crossSearchPage = (
  <Page
    tableView={<CrossSearchTable />}
    detailView={<LocalityDetails />}
    viewName="crosssearch"
    idFieldName="lid"
    createTitle={(loc: LocalityDetailsType) => `${loc.lid} ${loc.loc_name}, ${loc.country}`}
    createSubtitle={(loc: LocalityDetailsType) =>
      `${loc.dms_lat}, ${loc.dms_long}` + `\n${loc.max_age} Ma (${loc.bfa_max}) – ${loc.min_age} Ma (${loc.bfa_min})`
    }
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
)

// from UpdateTab
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

const createReferenceSubtitle = (ref: ReferenceDetailsType) => {
  const authorsSurnames = ref.ref_authors.filter(author => author.field_id === 2).map(author => author.author_surname)
  const editorsSurnames = ref.ref_authors.filter(author => author.field_id === 12).map(author => author.author_surname)
  const authorsPart = `${makeNameList(authorsSurnames)}`
  const editorsPart = `${makeNameList(editorsSurnames)} ${editorsSurnames.length > 1 ? '(eds)' : '(ed)'}`

  let title = `${authorsPart} (${ref.date_primary}).`

  switch (ref.ref_type_id) {
    case 1: // Journal
      title += ` ${ref.title_primary}. ${ref.ref_journal.journal_title}`
      if (ref.volume) {
        title += ` ${ref.volume}`
      }
      if (ref.issue) {
        title += ` (${ref.issue})`
      }
      if (ref.start_page || ref.end_page) {
        title += `: `
      }
      if (ref.start_page) {
        title += `${ref.start_page}-`
      }
      if (ref.end_page) {
        title += `${ref.end_page}`
      }
      if (ref.volume || ref.issue || ref.start_page || ref.end_page) {
        title += `.`
      }
      return title
    case 2: // Book
      title += ` ${ref.title_primary}.`
      if (ref.publisher || ref.pub_place) {
        title += ` `
      }
      if (ref.publisher) {
        title += `${ref.publisher}`
      }
      if (ref.publisher && ref.pub_place) {
        title += `, `
      }
      if (ref.pub_place) {
        title += `${ref.pub_place}`
      }
      if (ref.publisher || ref.pub_place) {
        title += `.`
      }
      return title
    case 3: // Book Chapter
      title += ` ${ref.title_primary}. IN: ${editorsPart} ${ref.title_secondary}.`

      if (ref.start_page || ref.end_page) {
        title += ` pp.`
      }
      if (ref.start_page) {
        title += `${ref.start_page}`
      }
      if (ref.start_page && ref.end_page) {
        title += `-`
      }
      if (ref.end_page) {
        title += `${ref.end_page}`
      }
      if (ref.start_page || ref.end_page) {
        title += `.`
      }
      if (ref.publisher || ref.pub_place) {
        title += ` `
      }
      if (ref.publisher) {
        title += `${ref.publisher}`
      }
      if (ref.publisher && ref.pub_place) {
        title += `, `
      }
      if (ref.pub_place) {
        title += `${ref.pub_place}`
      }
      if (ref.publisher || ref.pub_place) {
        title += `.`
      }
      return title
    default:
      if (ref.title_primary) {
        title += ` ${ref.title_primary}.`
      }
      if (ref.title_secondary) {
        title += ` ${ref.title_secondary}.`
      }
      if (ref.title_series) {
        title += ` ${ref.title_series}.`
      }
      if (ref.gen_notes) {
        title += ` ${ref.gen_notes}.`
      }
      return title
  }
}

export const referencePage = (
  <Page
    tableView={<ReferenceTable />}
    detailView={<ReferenceDetails />}
    viewName="reference"
    idFieldName="rid"
    createTitle={(ref: ReferenceDetailsType) => `${ref.rid}`}
    createSubtitle={createReferenceSubtitle}
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
    createTitle={(tu: TimeUnitDetailsType) => `(${tu.tu_name}) ${tu.tu_display_name} - ${tu.tu_comment}`}
    createSubtitle={(tu: TimeUnitDetailsType) =>
      `${tu.up_bnd} Ma – ${tu.low_bnd} Ma` + `\n${tu.sequence}` + `\n${tu.rank}`
    }
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
    createTitle={(tb: TimeBoundDetailsType) => `${tb.bid} ${tb.b_name}`}
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
