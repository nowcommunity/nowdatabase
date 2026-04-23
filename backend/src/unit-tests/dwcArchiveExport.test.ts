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

    expect(row.taxonID).toEqual('123')
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
      body_mass: BigInt(2500),
      brain_mass: null,
      diet1: '-',
      diet2: 'Herbivore',
      diet3: '',
      diet_description: 'Leaves',
      locomo1: null,
      locomo2: 'Arboreal',
      locomo3: null,
      activity: 'Diurnal',
      crowntype: null,
      microwear: 'High',
      mesowear: null,
      mw_value: 1.5,
    })

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
        body_mass: BigInt(70000),
        brain_mass: 1350,
        diet1: null,
        diet2: null,
        diet3: null,
        diet_description: null,
        locomo1: null,
        locomo2: null,
        locomo3: null,
        activity: null,
        crowntype: null,
        microwear: null,
        mesowear: null,
        mw_value: null,
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
    expect(metaXml).toContain('fieldsEnclosedBy="&quot;"')
    expect(metaXml).not.toContain('fieldsEnclosedBy="\\""')
  })
})
