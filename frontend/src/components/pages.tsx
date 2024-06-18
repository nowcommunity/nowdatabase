import {
  TimeUnitDetailsType,
  ReferenceDetailsType,
  SpeciesDetailsType,
  LocalityDetailsType,
  TimeBoundDetailsType,
  PersonDetailsType,
  ProjectDetailsType,
  RegionDetails as RegionDetailsType,
  UserDetailsType,
} from '@/backendTypes'
import { LocalityDetails } from './Locality/LocalityDetails'
import { LocalityTable } from './Locality/LocalityTable'
import { Page } from './Page'
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
import { UserTable } from './User/UserTable'
import { UserDetails } from './User/UserDetails'

export const timeBoundPage = (
  <Page
    tableView={<TimeBoundTable />}
    detailView={<TimeBoundDetails />}
    viewName="time-bound"
    idFieldName="bid"
    createTitle={(tb: TimeBoundDetailsType) => `${tb.b_name}`}
  />
)

export const timeUnitPage = (
  <Page
    tableView={<TimeUnitTable />}
    detailView={<TimeUnitDetails />}
    viewName="time-unit"
    idFieldName="tu_name"
    createTitle={(tu: TimeUnitDetailsType) => `${tu.tu_display_name}`}
  />
)

export const referencePage = (
  <Page
    tableView={<ReferenceTable />}
    detailView={<ReferenceDetails />}
    viewName="reference"
    idFieldName="rid"
    createTitle={(ref: ReferenceDetailsType) => `${ref.title_primary}`}
  />
)

export const speciesPage = (
  <Page
    tableView={<SpeciesTable />}
    detailView={<SpeciesDetails />}
    viewName="species"
    idFieldName="species_id"
    createTitle={(species: SpeciesDetailsType) => `${species.species_name}`}
  />
)

export const localityPage = (
  <Page
    tableView={<LocalityTable />}
    detailView={<LocalityDetails />}
    viewName="locality"
    idFieldName="lid"
    createTitle={(loc: LocalityDetailsType) => `${loc.loc_name}`}
  />
)

export const personPage = (
  <Page
    tableView={<PersonTable />}
    detailView={<PersonDetails />}
    viewName="person"
    idFieldName="initials"
    createTitle={(person: PersonDetailsType) => `${person.surname}`}
  />
)

export const projectPage = (
  <Page
    tableView={<ProjectTable />}
    detailView={<ProjectDetails />}
    viewName="project"
    idFieldName="pid"
    createTitle={(project: ProjectDetailsType) => `${project.proj_name}`}
  />
)

export const regionPage = (
  <Page<RegionDetailsType>
    tableView={<RegionTable />}
    detailView={<RegionDetails />}
    viewName="region"
    idFieldName="reg_coord_id"
    createTitle={(region: RegionDetailsType) => `${region.region}`}
  />
)

export const userPage = (
  <Page
    tableView={<UserTable />}
    detailView={<UserDetails />}
    viewName="user"
    idFieldName="user_id"
    createTitle={(user: UserDetailsType) => `${user.user_name}`}
  />
)
