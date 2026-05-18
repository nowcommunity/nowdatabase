import { describe, expect, it } from '@jest/globals'
import JSZip from 'jszip'
import {
  buildDwcArchiveZipBufferFromSpecies,
  buildMetaXml,
  mapSpeciesToMeasurementRows,
  mapSpeciesToTaxonRow,
} from '../services/dwcArchiveExport'

describe('DwC-A export mapping', () => {
  it('maps com_species row to a DwC Taxon row', () => {
    const row = mapSpeciesToTaxonRow({
      species_id: 123,
      class_name: 'Mammalia',
      subclass_or_superorder_name: null,
      order_name: 'Carnivora',
      suborder_or_superfamily_name: null,
      family_name: 'Felidae',
      subfamily_name: 'Felinae',
      genus_name: 'Felis',
      species_name: 'catus',
      unique_identifier: '-',
      taxonomic_status: null,
      common_name: 'Cat',
      sp_author: 'Linnaeus, 1758',
      sp_comment: 'Test comment',
    })

    expect(row.taxonID).toEqual('NOW:123')
    expect(row.nomenclaturalCode).toEqual('ICZN')
    expect(row.scientificName).toEqual('Felis catus Linnaeus, 1758')
    expect(row.genericName).toEqual('Felis')
    expect(row.scientificNameAuthorship).toEqual('Linnaeus, 1758')
    expect(row.vernacularName).toEqual('Cat')
    expect(row.taxonRank).toEqual('species')
    expect(row.taxonomicStatus).toEqual('accepted')
    expect(row.kingdom).toEqual('Animalia')
    expect(row.phylum).toEqual('Chordata')
    expect(row.superfamily).toEqual('')
    expect(row.subfamily).toEqual('Felinae')
    expect(row.tribe).toEqual('')
    expect(row.subtribe).toEqual('')
    expect(row.higherClassification).toEqual('Mammalia|Carnivora|Felidae|Felinae')
    expect(row.taxonRemarks).toEqual('Test comment')
  })

  it('generates measurement rows only for meaningful values', () => {
    const rows = mapSpeciesToMeasurementRows({
      species_id: 123,
      strain: null,
      gene: null,
      taxon_status: null,
      body_mass: BigInt(2500),
      brain_mass: null,
      sv_length: null,
      sd_size: null,
      sd_display: null,
      tshm: null,
      symph_mob: null,
      relative_blade_length: null,
      tht: null,
      diet1: '-',
      diet2: 'Herbivore',
      diet3: '',
      diet_description: 'Leaves',
      rel_fib: null,
      selectivity: null,
      digestion: null,
      feedinghab1: null,
      feedinghab2: null,
      shelterhab1: null,
      shelterhab2: null,
      locomo1: null,
      locomo2: 'Arboreal',
      locomo3: null,
      hunt_forage: null,
      activity: 'Diurnal',
      crowntype: null,
      microwear: 'High',
      horizodonty: null,
      cusp_shape: null,
      cusp_count_buccal: null,
      cusp_count_lingual: null,
      loph_count_lon: null,
      loph_count_trs: null,
      fct_al: null,
      fct_ol: null,
      fct_sf: null,
      fct_ot: null,
      fct_cm: null,
      mesowear: null,
      mw_or_high: null,
      mw_or_low: null,
      mw_cs_sharp: null,
      mw_cs_round: null,
      mw_cs_blunt: null,
      mw_scale_min: null,
      mw_scale_max: null,
      mw_value: 1.5,
      pop_struc: null,
      sp_status: null,
    })

    expect(rows.some(row => row.taxonID === 'NOW:123')).toEqual(true)

    const ids = rows.map(row => row.measurementID)
    expect(ids).toContain('NOW:123:body_mass')
    expect(ids).toContain('NOW:123:diet2')
    expect(ids).toContain('NOW:123:diet_description')
    expect(ids).toContain('NOW:123:locomo2')
    expect(ids).toContain('NOW:123:activity')
    expect(ids).toContain('NOW:123:microwear')
    expect(ids).toContain('NOW:123:mw_value')
    expect(ids).not.toContain('NOW:123:brain_mass')
    expect(ids).not.toContain('NOW:123:diet1')
    expect(ids).not.toContain('NOW:123:diet3')
  })

  it('produces a ZIP containing the expected DwC-A files', async () => {
    const zipBuffer = await buildDwcArchiveZipBufferFromSpecies([
      {
        species_id: 1,
        class_name: 'Mammalia',
        subclass_or_superorder_name: null,
        order_name: 'Primates',
        suborder_or_superfamily_name: null,
        family_name: 'Hominidae',
        subfamily_name: null,
        genus_name: 'Homo',
        species_name: 'sapiens',
        unique_identifier: '-',
        taxonomic_status: 'accepted',
        common_name: 'Human',
        sp_author: null,
        sp_comment: null,
        strain: null,
        gene: null,
        taxon_status: null,
        body_mass: BigInt(70000),
        brain_mass: 1350,
        sv_length: null,
        sd_size: null,
        sd_display: null,
        tshm: null,
        symph_mob: null,
        relative_blade_length: null,
        tht: null,
        diet1: null,
        diet2: null,
        diet3: null,
        diet_description: null,
        rel_fib: null,
        selectivity: null,
        digestion: null,
        feedinghab1: null,
        feedinghab2: null,
        shelterhab1: null,
        shelterhab2: null,
        locomo1: null,
        locomo2: null,
        locomo3: null,
        hunt_forage: null,
        activity: null,
        crowntype: null,
        microwear: null,
        mesowear: null,
        horizodonty: null,
        cusp_shape: null,
        cusp_count_buccal: null,
        cusp_count_lingual: null,
        loph_count_lon: null,
        loph_count_trs: null,
        fct_al: null,
        fct_ol: null,
        fct_sf: null,
        fct_ot: null,
        fct_cm: null,
        mw_or_high: null,
        mw_or_low: null,
        mw_cs_sharp: null,
        mw_cs_round: null,
        mw_cs_blunt: null,
        mw_scale_min: null,
        mw_scale_max: null,
        mw_value: null,
        pop_struc: null,
        sp_status: null,
      },
    ])

    const zip = await JSZip.loadAsync(zipBuffer)
    expect(zip.file('taxon.csv')).toBeTruthy()
    expect(zip.file('measurementorfact.csv')).toBeTruthy()
    expect(zip.file('meta.xml')).toBeTruthy()
    expect(zip.file('eml.xml')).toBeTruthy()
  })

  it('generates valid meta.xml attributes for enclosed fields', () => {
    const metaXml = buildMetaXml()
    expect(metaXml).toContain("fieldsEnclosedBy='\"'")
    expect(metaXml).not.toContain('fieldsEnclosedBy="&quot;"')
    expect(metaXml).not.toContain('fieldsEnclosedBy="\\""')
  })
})
