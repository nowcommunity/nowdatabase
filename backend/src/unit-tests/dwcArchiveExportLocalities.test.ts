import { describe, expect, it } from '@jest/globals'
import JSZip from 'jszip'
import {
  buildDwcLocalityArchiveZipBufferFromLocalities,
  buildLocalityMetaXml,
  mapLocalityToGeologicalContextRow,
  mapLocalityToLocationRow,
  mapLocalityToMeasurementRows,
} from '../services/dwcArchiveExportLocalities'

describe('DwC-A locality export mapping', () => {
  const baseLocality = {
    lid: 42,
    loc_name: 'Test locality',
    country: 'Finland',
    state: 'Uusimaa',
    county: 'Helsinki',
    dec_lat: 60.1699,
    dec_long: 24.9384,
    dms_lat: null,
    dms_long: null,
    loc_detail: 'Some notes',
    chron: 'Test chron',
    lgroup: 'Test group',
    formation: 'Test formation',
    member: 'Test member',
    bed: 'Test bed',
    bfa_max: 'BFA_MAX',
    bfa_min: 'BFA_MIN',
    max_age: 12.3,
    min_age: 4.5,
    date_meth: 'radioisotope',
    age_comm: 'Age comment',
    now_time_unit_now_loc_bfa_maxTonow_time_unit: null,
    now_time_unit_now_loc_bfa_minTonow_time_unit: null,
  } as const

  it('maps now_loc row to a DwC Location row', () => {
    const row = mapLocalityToLocationRow(baseLocality)
    expect(row.locationID).toEqual('NOW:LOC:42')
    expect(row.locality).toEqual('Test locality')
    expect(row.country).toEqual('Finland')
    expect(row.stateProvince).toEqual('Uusimaa')
    expect(row.county).toEqual('Helsinki')
    expect(row.decimalLatitude).toEqual('60.1699')
    expect(row.decimalLongitude).toEqual('24.9384')
    expect(row.locationRemarks).toContain('Some notes')
  })

  it('maps now_loc row to a DwC GeologicalContext row', () => {
    const row = mapLocalityToGeologicalContextRow(baseLocality)
    expect(row.locationID).toEqual('NOW:LOC:42')
    expect(row.geologicalContextID).toEqual('NOW:LOC:42:geology')
    expect(row.group).toEqual('Test group')
    expect(row.formation).toEqual('Test formation')
    expect(row.member).toEqual('Test member')
    expect(row.bed).toEqual('Test bed')
    expect(row.earliestAgeOrLowestStage).toEqual('BFA_MAX')
    expect(row.latestAgeOrHighestStage).toEqual('BFA_MIN')
  })

  it('emits locality measurements only for meaningful values', () => {
    const rows = mapLocalityToMeasurementRows({
      ...baseLocality,
      chron: '-',
      bfa_min: null,
    })
    expect(rows.some(r => r.verbatimMeasurementType === 'max_age')).toEqual(true)
    expect(rows.some(r => r.verbatimMeasurementType === 'min_age')).toEqual(true)
    expect(rows.some(r => r.verbatimMeasurementType === 'chron')).toEqual(false)
    expect(rows.some(r => r.verbatimMeasurementType === 'bfa_min')).toEqual(false)
  })

  it('generates a ZIP archive with expected files', async () => {
    const zipBuffer = await buildDwcLocalityArchiveZipBufferFromLocalities([baseLocality])
    const zip = await JSZip.loadAsync(zipBuffer)
    expect(zip.file('location.csv')).toBeTruthy()
    expect(zip.file('geologicalcontext.csv')).toBeTruthy()
    expect(zip.file('measurementorfact.csv')).toBeTruthy()
    expect(zip.file('meta.xml')).toBeTruthy()
    expect(zip.file('eml.xml')).toBeTruthy()
  })

  it('generates valid meta.xml attributes for enclosed fields', () => {
    const metaXml = buildLocalityMetaXml()
    expect(metaXml).toContain("fieldsEnclosedBy='\"'")
    expect(metaXml).not.toContain('fieldsEnclosedBy="&quot;"')
    expect(metaXml).not.toContain('fieldsEnclosedBy="\\""')
  })
})
