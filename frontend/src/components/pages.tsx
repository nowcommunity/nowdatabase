import {
  TimeUnitDetailsType,
  ReferenceDetailsType,
  SpeciesDetailsType,
  LocalityDetailsType,
  TimeBoundDetailsType,
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
