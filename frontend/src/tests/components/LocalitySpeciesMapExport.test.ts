import { describe, expect, it } from '@jest/globals'

import {
  getUniqueOccurrenceMapExportLocalities,
  getUniqueSpeciesLocalityMapExportLocalities,
  toMapExportLocality,
} from '@/components/Species/localitySpeciesMapExport'
import { generateKml } from '@/util/kml'
import type { LocalityDetailsType, LocalitySpecies, SpeciesLocality } from '@/shared/types'

const speciesLocality = (overrides: unknown): SpeciesLocality => overrides as SpeciesLocality
const localitySpecies = (overrides: unknown): LocalitySpecies => overrides as LocalitySpecies
const locality = (overrides: unknown): LocalityDetailsType => overrides as LocalityDetailsType

describe('locality species map export helpers', () => {
  it('maps a species locality row to a locality export row', () => {
    const result = toMapExportLocality({
      lid: 123,
      loc_name: 'Test locality',
      country: 'Finland',
      dms_lat: '60 00 N',
      dms_long: '25 00 E',
      dec_lat: '60.5',
      dec_long: '25.25',
      max_age: '12.5',
      min_age: '10.2',
      altitude: null,
      appr_num_spm: null,
    })

    expect(result).toMatchObject({
      lid: 123,
      loc_name: 'Test locality',
      country: 'Finland',
      dec_lat: 60.5,
      dec_long: 25.25,
      max_age: 12.5,
      min_age: 10.2,
      altitude: 0,
      appr_num_spm: 0,
    })
  })

  it('deduplicates localities and skips rows without valid coordinates', () => {
    const rows = [
      speciesLocality({ lid: 1, now_loc: { lid: 1, loc_name: 'A', dec_lat: 1, dec_long: 2 } }),
      speciesLocality({ lid: 1, now_loc: { lid: 1, loc_name: 'A duplicate', dec_lat: 1, dec_long: 2 } }),
      speciesLocality({ lid: 2, now_loc: { lid: 2, loc_name: 'B', dec_lat: null, dec_long: 2 } }),
      speciesLocality({ lid: 3, now_loc: { lid: 3, loc_name: 'C', dec_lat: 3, dec_long: 4 } }),
    ]

    expect(getUniqueSpeciesLocalityMapExportLocalities(rows).map(locality => locality.lid)).toEqual([1, 3])
  })

  it('adds unique species names to species locality exports', () => {
    const rows = [
      speciesLocality({
        species_id: 100,
        lid: 1,
        genus_name: 'Panthera',
        species_name: 'leo',
        unique_identifier: '-',
        now_loc: { lid: 1, loc_name: 'A', dec_lat: 1, dec_long: 2 },
      }),
      speciesLocality({
        species_id: 101,
        lid: 1,
        genus_name: 'Panthera',
        species_name: 'pardus',
        unique_identifier: 'cf.',
        now_loc: { lid: 1, loc_name: 'A', dec_lat: 1, dec_long: 2 },
      }),
      speciesLocality({
        species_id: 101,
        lid: 1,
        genus_name: 'Panthera',
        species_name: 'pardus',
        unique_identifier: 'cf.',
        now_loc: { lid: 1, loc_name: 'A', dec_lat: 1, dec_long: 2 },
      }),
    ]

    expect(getUniqueSpeciesLocalityMapExportLocalities(rows)[0]?.species).toEqual([
      'Panthera leo',
      'Panthera pardus cf.',
    ])
  })

  it('adds species names from occurrence rows for a locality tab export', () => {
    const result = getUniqueOccurrenceMapExportLocalities(
      locality({ lid: 1, loc_name: 'A', dec_lat: 1, dec_long: 2 }),
      [
        localitySpecies({
          com_species: { species_id: 100, genus_name: 'Ursus', species_name: 'arctos', unique_identifier: '-' },
        }),
        localitySpecies({
          com_species: { species_id: 101, genus_name: 'Vulpes', species_name: 'vulpes', unique_identifier: null },
        }),
      ]
    )

    expect(result).toHaveLength(1)
    expect(result[0]?.species).toEqual(['Ursus arctos', 'Vulpes vulpes'])
  })

  it('writes species lists into KML descriptions when provided', () => {
    const exportLocality = toMapExportLocality({
      lid: 1,
      loc_name: 'A',
      country: 'Finland',
      dms_lat: '60 00 N',
      dms_long: '25 00 E',
      dec_lat: 1,
      dec_long: 2,
      species: ['Ursus arctos', 'Vulpes vulpes'],
    })

    expect(exportLocality).not.toBeNull()
    if (!exportLocality) return

    const kml = generateKml([exportLocality])

    expect(kml).toContain('<b>Species:</b>')
    expect(kml).toContain('<li>Ursus arctos</li>')
    expect(kml).toContain('<li>Vulpes vulpes</li>')
  })
})
