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
    site_area: null,
    gen_loc: null,
    plate: null,
    appr_num_spm: null,
    num_spm: null,
    true_quant: null,
    complete: null,
    num_quad: null,
    rock_type: null,
    rt_adj: null,
    lith_comm: null,
    depo_context1: null,
    depo_context2: null,
    depo_context3: null,
    depo_context4: null,
    depo_comm: null,
    sed_env_1: null,
    sed_env_2: null,
    event_circum: null,
    se_comm: null,
    assem_fm: null,
    transport: null,
    trans_mod: null,
    weath_trmp: null,
    pt_conc: null,
    size_type: null,
    vert_pres: null,
    plant_pres: null,
    invert_pres: null,
    time_rep: null,
    taph_comm: null,
    tax_comm: null,
    datum_plane: null,
    tos: null,
    bos: null,
    loc_status: null,
    hominin_skeletal_remains: false,
    climate_type: null,
    biome: null,
    v_ht: null,
    v_struct: null,
    v_envi_det: null,
    disturb: null,
    nutrients: null,
    water: null,
    seasonality: null,
    seas_intens: null,
    pri_prod: null,
    moisture: null,
    temperature: null,
    estimate_precip: null,
    estimate_temp: null,
    estimate_npp: null,
    pers_woody_cover: null,
    pers_pollen_ap: null,
    pers_pollen_nap: null,
    pers_pollen_other: null,
    stone_tool_cut_marks_on_bones: false,
    bipedal_footprints: false,
    stone_tool_technology: false,
    technological_mode_1: null,
    technological_mode_2: null,
    technological_mode_3: null,
    cultural_stage_1: null,
    cultural_stage_2: null,
    cultural_stage_3: null,
    regional_culture_1: null,
    regional_culture_2: null,
    regional_culture_3: null,
    now_syn_loc: [],
    now_ss: [],
    now_coll_meth: [],
    now_mus: [],
    now_plr: [],
    now_lau: [],
    now_ls: [],
    now_time_unit_now_loc_bfa_maxTonow_time_unit: null,
    now_time_unit_now_loc_bfa_minTonow_time_unit: null,
  } as const

  it('maps now_loc row to a DwC Location row', () => {
    const row = mapLocalityToLocationRow(baseLocality)
    expect(row.locationID).toEqual('NOW:LOC:42')
    expect(row.locality).toEqual('Test locality')
    expect(row.continent).toEqual('Europe')
    expect(row.country).toEqual('Finland')
    expect(row.stateProvince).toEqual('Uusimaa')
    expect(row.county).toEqual('Helsinki')
    expect(row.higherGeography).toEqual('Europe|Finland|Uusimaa|Helsinki|Test basin|Test subbasin')
    expect(row.decimalLatitude).toEqual('60.1699')
    expect(row.decimalLongitude).toEqual('24.9384')
    expect(row.verbatimElevation).toEqual('123')
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

  it('concatenates collecting methods with |', () => {
    const rows = mapLocalityToMeasurementRows({
      ...baseLocality,
      now_coll_meth: [{ coll_meth: 'screenwash' }, { coll_meth: 'quarry' }],
    })
    const collectingMethodsRow = rows.find(r => r.verbatimMeasurementType === 'now_coll_meth.coll_meth')
    expect(collectingMethodsRow?.measurementValue).toEqual('screenwash|quarry')
  })

  it('uses parentMeasurementID for stratigraphy fields', () => {
    const rows = mapLocalityToMeasurementRows({
      ...baseLocality,
      datum_plane: 'Datum',
      tos: 0,
      bos: 12.5,
    })
    const parent = rows.find(r => r.verbatimMeasurementType === 'stratigraphy')
    expect(parent).toBeTruthy()
    const tosRow = rows.find(r => r.verbatimMeasurementType === 'tos')
    const bosRow = rows.find(r => r.verbatimMeasurementType === 'bos')
    expect(tosRow?.parentMeasurementID).toEqual(parent?.measurementID)
    expect(bosRow?.parentMeasurementID).toEqual(parent?.measurementID)
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
