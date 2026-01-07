import { describe, it, expect, beforeAll } from '@jest/globals'
import {
  deleteTestLocality,
  createTestLocality,
  updateTestLocality,
} from '../helpers/locality'
import now_loc from '../../../now_test_data/now_loc.json'
import now_ls from '../../../now_test_data/now_ls.json'

let resultLocality: typeof now_loc[0] | undefined

describe('Update locality', () => {
  beforeAll(async () => {
    await deleteTestLocality()
    await createTestLocality()
    resultLocality = await updateTestLocality()
  })

  it('Update returns a locality object', () => {
    expect(resultLocality).toBeDefined()
  })

  it('Locality ID is not changed', () => {
    expect(resultLocality!.lid).toEqual(21050)
  })

  it('Locality name is changed', () => {
    expect(resultLocality!.loc_name).toEqual('Updated Locality Name')
  })

  it('Locality species are changed', () => {
    expect(resultLocality!.now_ls).toBeDefined()
  })

  it('Locality species is an array', () => {
    expect(Array.isArray(resultLocality!.now_ls)).toEqual(true)
  })

  it('Locality species array has 1 item', () => {
    expect(resultLocality!.now_ls.length).toEqual(1)
  })

  it('Added locality species is found', () => {
    const found = resultLocality!.now_ls.find(ls => {
      return ls.species_id === 21052 && ls.lid === 21050
    })
    expect(found).toBeDefined()
  })

  it('Removed locality species is not found', () => {
    const found = resultLocality!.now_ls.find(ls => {
      return ls.species_id === 21051 && ls.lid === 21050
    })
    expect(found).toBeUndefined()
  })
})
