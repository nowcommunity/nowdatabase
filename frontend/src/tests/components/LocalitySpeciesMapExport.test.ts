import { describe, expect, it } from '@jest/globals'

import { getUniqueMapExportLocalities, toMapExportLocality } from '@/components/Species/localitySpeciesMapExport'
import type { SpeciesLocality } from '@/shared/types'

const speciesLocality = (overrides: unknown): SpeciesLocality => overrides as SpeciesLocality

describe('locality species map export helpers', () => {
  it('maps a species locality row to a locality export row', () => {
    const result = toMapExportLocality(
      speciesLocality({
        lid: 123,
        now_loc: {
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
        },
      })
    )

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

    expect(getUniqueMapExportLocalities(rows).map(locality => locality.lid)).toEqual([1, 3])
  })
})
