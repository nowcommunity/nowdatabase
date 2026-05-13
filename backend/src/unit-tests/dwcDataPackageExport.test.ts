import { describe, expect, it } from '@jest/globals'
import JSZip from 'jszip'
import {
  DWC_DP_TABLES,
  buildDwcDataPackageZipBufferFromRows,
  mapLocalityToDwcDpEventAssertionRows,
  mapLocalityToDwcDpEventRow,
  mapOccurrenceToDwcDpOccurrenceAssertionRows,
  mapOccurrenceToDwcDpOccurrenceRow,
  type DwcDpLocalityFixture,
  type DwcDpOccurrenceFixture,
} from '../services/dwcDataPackageExport'

describe('DwC-DP export mapping', () => {
  const locality = {
    lid: 42,
    loc_name: 'Test locality',
    basin: 'Test basin',
    subbasin: 'Test subbasin',
    country: 'Finland',
    state: 'Uusimaa',
    county: 'Helsinki',
    dec_lat: 60.1699,
    dec_long: 24.9384,
    dms_lat: null,
    dms_long: null,
    approx_coord: null,
    altitude: 123,
    loc_detail: 'Some notes',
    tax_comm: null,
    chron: 'Test chron',
    lgroup: 'Test group',
    formation: 'Test formation',
    member: 'Test member',
    bed: 'Test bed',
    bfa_max: 'BFA_MAX',
    bfa_min: 'BFA_MIN',
    bfa_max_abs: null,
    bfa_min_abs: null,
    frac_max: null,
    frac_min: null,
    max_age: 12.3,
    min_age: 4.5,
    date_meth: 'radioisotope',
    age_comm: 'Age comment',
    appr_num_spm: null,
    num_spm: null,
    hominin_skeletal_remains: false,
    stone_tool_cut_marks_on_bones: false,
    bipedal_footprints: false,
    stone_tool_technology: false,
    now_syn_loc: [],
    now_ss: [],
    now_coll_meth: [],
    now_mus: [],
    now_ls: [],
    now_time_unit_now_loc_bfa_maxTonow_time_unit: null,
    now_time_unit_now_loc_bfa_minTonow_time_unit: null,
  } as unknown as DwcDpLocalityFixture

  const occurrence = {
    lid: 42,
    species_id: 21052,
    nis: 7,
    pct: null,
    quad: null,
    mni: 2,
    qua: 'A',
    id_status: 'confirmed',
    orig_entry: 'Original occurrence note',
    source_name: 'Source collection',
    body_mass: BigInt(1234),
    mesowear: null,
    mw_or_high: null,
    mw_or_low: null,
    mw_cs_sharp: null,
    mw_cs_round: null,
    mw_cs_blunt: null,
    mw_scale_min: null,
    mw_scale_max: null,
    mw_value: null,
    microwear: null,
    dc13_mean: -11.2,
    dc13_n: 4,
    dc13_max: null,
    dc13_min: null,
    dc13_stdev: null,
    do18_mean: null,
    do18_n: null,
    do18_max: null,
    do18_min: null,
    do18_stdev: null,
    com_species: {
      species_id: 21052,
      class_name: 'Mammalia',
      subclass_or_superorder_name: null,
      order_name: 'Rodentia',
      suborder_or_superfamily_name: null,
      family_name: 'Testidae',
      subfamily_name: null,
      genus_name: 'Simplomys',
      species_name: 'simplicidens',
      unique_identifier: '-',
      taxonomic_status: null,
      common_name: null,
      sp_author: 'Test Author',
      sp_comment: null,
    },
  } as unknown as DwcDpOccurrenceFixture

  it('maps NOW localities to DwC-DP events and event assertions', () => {
    const eventRow = mapLocalityToDwcDpEventRow(locality)
    expect(eventRow).toEqual(
      expect.objectContaining({
        eventID: 'NOW:EVENT:42',
        eventType: 'paleontological locality',
        locationID: 'NOW:LOC:42',
        locality: 'Test locality',
        geologicalContextID: 'NOW:GEO:42',
      })
    )

    const assertionRows = mapLocalityToDwcDpEventAssertionRows(locality)
    expect(assertionRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventID: 'NOW:EVENT:42',
          assertionID: 'NOW:EVENT:42:max_age',
          verbatimAssertionType: 'max_age',
          assertionValueNumeric: '12.3',
          assertionUnit: 'Ma',
        }),
      ])
    )
  })

  it('maps NOW locality-species rows to DwC-DP occurrences and occurrence assertions', () => {
    const occurrenceRow = mapOccurrenceToDwcDpOccurrenceRow(occurrence)
    expect(occurrenceRow).toEqual(
      expect.objectContaining({
        occurrenceID: 'NOW:OCC:42:21052',
        eventID: 'NOW:EVENT:42',
        taxonID: 'NOW:21052',
        scientificName: 'Simplomys simplicidens Test Author',
        identificationVerificationStatus: 'confirmed',
      })
    )

    const assertionRows = mapOccurrenceToDwcDpOccurrenceAssertionRows(occurrence)
    expect(assertionRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          occurrenceID: 'NOW:OCC:42:21052',
          assertionID: 'NOW:OCC:42:21052:now_ls.body_mass',
          verbatimAssertionType: 'now_ls.body_mass',
          assertionValueNumeric: '1234',
          assertionUnit: 'g',
        }),
      ])
    )
  })

  it('generates a ZIP archive with DwC-DP files and relational metadata', async () => {
    const zipBuffer = await buildDwcDataPackageZipBufferFromRows({
      localities: [locality],
      occurrences: [occurrence],
      publicationDateIso: '2026-05-13',
    })

    const zip = await JSZip.loadAsync(zipBuffer)
    expect(zip.file(DWC_DP_TABLES.event)).toBeTruthy()
    expect(zip.file(DWC_DP_TABLES.geologicalContext)).toBeTruthy()
    expect(zip.file(DWC_DP_TABLES.occurrence)).toBeTruthy()
    expect(zip.file(DWC_DP_TABLES.eventAssertion)).toBeTruthy()
    expect(zip.file(DWC_DP_TABLES.occurrenceAssertion)).toBeTruthy()
    expect(zip.file(DWC_DP_TABLES.dataPackage)).toBeTruthy()
    expect(zip.file(DWC_DP_TABLES.eml)).toBeTruthy()

    const dataPackageJson = JSON.parse(await zip.file(DWC_DP_TABLES.dataPackage)!.async('string')) as {
      resources: Array<{ name: string; schema: { foreignKeys?: unknown[] } }>
    }
    expect(dataPackageJson.resources.map(resource => resource.name)).toEqual([
      'event',
      'geological-context',
      'occurrence',
      'event-assertion',
      'occurrence-assertion',
    ])
    expect(dataPackageJson.resources.find(resource => resource.name === 'occurrence')?.schema.foreignKeys).toEqual([
      {
        fields: 'eventID',
        reference: { resource: 'event', fields: 'eventID' },
      },
    ])
  })
})
